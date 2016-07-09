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



