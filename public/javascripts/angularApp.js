var app = angular.module('nflStats', ['ui.router', 'tc.chartjs']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          // Get data on page load:
          resolveTeams: ['teams',
            function(teams) {
              return teams.getTeams();
            }
          ],
          resolveReceivers: ['receivers',
            function(receivers) {
              return receivers.getReceivers("GB", 2015);
            }
          ]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);


/*
 * Operations for obtaining team information:
 */
app.factory('teams', ['$http',
  function($http) {

  var o = {
    teams: []
  };

  o.getTeams = function() {
    return $http.get('/teams').success(function(data) {
      angular.copy(data, o.teams);
    });
  };

  return o;
}]);

/**
 * Operations for obtaining valid years over which to query:
 */
app.factory('years', function() {

  var o = {
    years: []
  };

  o.years = [ 2010, 2011, 2012, 2014, 2015 ];

  return o;
});


/**
 * Operations for receiving receiver information:
 */
app.factory('receivers', ['$http', 'teams',
  function($http, teams) {

    var o = {
      players: []
    };

    o.getReceivers = function(team, year) {
      return $http.get('/receiving/' + team + '/' + year).success(function(receivers) {
        o.players.splice(0,o.players.length) // clear array, keep reference
        convertToSpie(receivers, o, teams.teams);
      });
    };

    return o;
  }
]);

app.controller('MainCtrl', [
  '$scope',
  'receivers',
  'teams',
  'years',
  function($scope, receivers, teams, years) {
    $scope.players = receivers.players;
    $scope.teams = teams.teams;
    $scope.years = years.years;
    $scope.selectedTeam = "GB";
    $scope.selectedYear = 2015;

    $scope.updateDisplay = function() {
      receivers.getReceivers($scope.selectedTeam, $scope.selectedYear);
    };
  }
]);

function convertToSpie(receivers, o, teams) {

  /*
   * Calculate total yards and receptions to normalize results against this:
   */
  var totalReceptionNumbers = 0;
  var totalYards = 0;

  for (var num in receivers) {
    if (receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];
      totalReceptionNumbers += parseFloat(receiver['REC']);
      totalYards += parseFloat(receiver['YDS']);
    }
  }

  /*
   * For each receiver, create a player object representing the state required by the spie chart.
   */
  for (var num in receivers) {
    if (receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];

      var Rwidth = (receiver['REC'] / parseFloat(totalReceptionNumbers)) * 100;
      var Rlabel = receiver['PLAYER'];

      var chartHeight = Math.max(parseFloat(10), ((receiver['YDS'] / parseFloat(totalYards)) * 100) * 2);

      var percentageYac = Math.min(parseFloat(1), parseFloat(receiver['YAC']) / parseFloat(receiver['YDS']));
      var percentageNonYac = 1.0 - percentageYac;

      var team = _.find(teams, function(obj) { return obj.code == receiver['TEAM'] })
      var primaryColor = team['primarycolor'] === undefined? "#FFFFFF": team['primarycolor'];
      var secondaryColor = team['secondarycolor'] === undefined? "000000": team['secondarycolor'];

      var sliceNonYac = {
        height: chartHeight * percentageNonYac,
        color: primaryColor,
        highlight: shadeColor(primaryColor, 0.2),
        label: Math.max(0, receiver['YDS'] - receiver['YAC']) + " yards in air"
      };

      var sliceYac = {
        height: chartHeight * percentageYac,
        color: secondaryColor,
        highlight: shadeColor(secondaryColor, 0.2),
        label: receiver['YAC'] + " yards after catch"
      };

      // Create new player info and add it to the results array:
      o.players.push({
        width: Rwidth,
        label: Rlabel,
        slices: [sliceYac, sliceNonYac]
      });
    }
  }

}

// From http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}