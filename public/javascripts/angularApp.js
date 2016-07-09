var app = angular.module('nflStats', ['ui.router', 'tc.chartjs', 'ngStorage']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$localStorageProvider',
  function($stateProvider, $urlRouterProvider, $localStorageProvider) {
    // Set a prefix for local storage, so we store in a unique location:
    $localStorageProvider.setKeyPrefix('nyc.angus.nfl');

    $stateProvider
      .state('home', {
        url: '/nfl/:teamA/:yearA',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: { // Get data on page load:
          resolveTeams: ['teams', resolveTeamsRequest],
          resolveReceivers: ['$stateParams', 'receivers', resolveReceiversRequest]
        }
      })
      .state('home.2', {
        url: '^/nfl/:teamA/:yearA/:teamB/:yearB',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: { // Get data on page load:
          resolveTeams: ['teams', resolveTeamsRequest],
          resolveReceivers: ['$stateParams', 'receivers', resolveReceiversRequest]
        }
      })
      .state('home.3', {
        url: '^/nfl/:teamA/:yearA/:teamB/:yearB/:teamC/:yearC',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: { // Get data on page load:
          resolveTeams: ['teams', resolveTeamsRequest],
          resolveReceivers: ['$stateParams', 'receivers', resolveReceiversRequest]
        }
      });

    $urlRouterProvider.otherwise('nfl/GB/2013/GB/2014/GB/2015');
  }
]);

function resolveTeamsRequest(teams) {
  return teams.getTeams();
}

function resolveReceiversRequest($stateParams, receivers) {
  request = [{
    team: $stateParams['teamA'],
    year: $stateParams['yearA']
  }];

  if ($stateParams['teamB'] != undefined && $stateParams['yearB'] != undefined) {
    request.push({
      team: $stateParams['teamB'],
      year: $stateParams['yearB']
    });
  }

  if ($stateParams['teamC'] != undefined && $stateParams['yearC'] != undefined) {
    request.push({
      team: $stateParams['teamC'],
      year: $stateParams['yearC']
    });
  }

  return receivers.getRequestedReceivers(request);
}


/*
 * Operations for obtaining team information:
 */
app.factory('teams', ['$http', '$localStorage',
  function($http, $localStorage) {

    var o = {
      teams: []
    };

    o.getTeams = function() {
      if ($localStorage.teams === undefined) {
        return $http.get('/teams').success(function(data) {
          $localStorage.teams = [];
          angular.copy(data, $localStorage.teams);
          angular.copy(data, o.teams);
        });
      } else {
        o.teams = $localStorage['teams'];
      }
      return o;
    };

    return o;
  }
]);

/**
 * Operations for obtaining valid years over which to query:
 */
app.factory('years', function() {

  var o = {
    years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]
  };

  return o;
});



app.controller('MainCtrl', [
  '$scope',
  '$state',
  'receivers',
  'teams',
  'years',
  function($scope, $state, receivers, teams, years) {
    $scope.teams = teams.teams;
    $scope.years = years.years;

    $scope.display = receivers.display;

    $scope.updateDisplay = function(chart) {
      // Change the URL, initiating a new request.
      var nextState = 'home' + (($scope.display.length > 1) ? "." + $scope.display.length: "");

      // Create query parameters from all defined team-year pairs:
      var params = {};

      for (i = 0; i < $scope.display.length; i++) {
        var letter = String.fromCharCode(65 + i);
        params['team' + letter] = $scope.display[i].selectedTeam;
        params['year' + letter] = $scope.display[i].selectedYear;
      }

      $state.go(nextState, params);
    };
  }
]);
