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
          postPromise: ['receivers',
            function(receivers) {
              return receivers.getReceivers("GB", 2015);
            }
          ]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);



app.factory('teams', function() {

  var o = {
    teams: []
  };

  o.teams =
    [{
    "short": "GB",
    "name": "Green Bay Packers"
  }, {
    "short": "DAL",
    "name": "Dallas Cowboys"
  }]

  return o;
});


app.factory('years', function() {

  var o = {
    years: []
  };

  o.years = [ 2010, 2011, 2012, 2014, 2015 ];

  return o;
});



app.factory('receivers', ['$http',
  function($http) {

    var o = {
      players: []
    };

    o.getReceivers = function(team, year) {
      return $http.get('/receiving/' + team + '/' + year).success(function(receivers) {
        o.players.splice(0,o.players.length)
        convertToSpie(receivers, o);
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

function convertToSpie(receivers, o) {

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


      var sliceNonYac = {
        height: chartHeight * percentageNonYac,
        color: "#203731",
        highlight: "#234D42",
        label: Math.max(0, receiver['YDS'] - receiver['YAC']) + " yards in air"
      };


      var sliceYac = {
        height: chartHeight * percentageYac,
        color: "#FFB612",
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