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
          resolveReceivers: ['receivers',
            function(receivers) {
              return receivers.getReceivers("GB", 2015);
            }
          ],
          resolveTeams: ['teams',
            function(teams) {
              return teams.getTeams();
            }
          ]

        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);



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


app.factory('years', function() {

  var o = {
    years: []
  };

  o.years = [ 2010, 2011, 2012, 2014, 2015 ];

  return o;
});



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

  var totalReceptionNumbers = 0;
  var totalYards = 0;

  for (var num in receivers) {
    if (receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];
      totalReceptionNumbers += parseFloat(receiver['REC']);
      totalYards += parseFloat(receiver['YDS']);
    }
  }

  for (var num in receivers) {
    if (receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];

      var Rwidth = (receiver['REC'] / parseFloat(totalReceptionNumbers)) * 100;
      var Rlabel = receiver['PLAYER'];

      var chartHeight = Math.max(parseFloat(10), ((receiver['YDS'] / parseFloat(totalYards)) * 100) * 2);

      var percentageYac = Math.min(parseFloat(1), parseFloat(receiver['YAC']) / parseFloat(receiver['YDS']));
      var percentageNonYac = 1.0 - percentageYac;

      var team = _.find(teams, function(obj) { return obj.code == receiver['TEAM'] })

      var sliceNonYac = {
        height: chartHeight * percentageNonYac,
        color: team['primarycolor'],
        highlight: "#234D42",
        label: Math.max(0, receiver['YDS'] - receiver['YAC']) + " yards in air"
      };


      var sliceYac = {
        height: chartHeight * percentageYac,
        color: team['secondarycolor'],
        highlight: "#F0AE1A",
        label: receiver['YAC'] + " yards after catch"
      };


      o.players.push({
        width: Rwidth,
        label: Rlabel,
        slices: [sliceYac, sliceNonYac]
      });
    }
  }

}