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


/**
 * Operations for receiving receiver information:
 */
app.factory('receivers', ['$http', 'teams', '$localStorage',
  function($http, teams, $localStorage) {

    var o = {
      /**
       * Expected format of 'display' entries:
       * selectedTeam: "GB",
       * selectedYear: 2013,
       * receivers: []
       */
      display: []
    };

    /**
     * @param  {[type]} request Array of dictionaries with entries for 'team' and 'year'
     */
    o.getRequestedReceivers = function(request) {
      o.display.splice(0, o.display.length) // clear array, keep reference



      // 1. Determine what team-year info is not in local storage
      if ($localStorage.teamyears === undefined) {
        $localStorage.teamyears = {};
      }
      // 2. Request unknown information and store it in local storage

      var remoteRequest = [];

      for (i = 0; i < request.length; i++) {
        var partial = request[i].team + "-" + request[i].year;

        if ($localStorage.teamyears[partial] == undefined) {
          remoteRequest.push(request[i]);
        }

        o.display.push({
          selectedTeam: request[i].team,
          selectedYear: request[i].year,
          receivers: []
        });
      }
      // 3. Execute request as normal entirely from local storage.


      if (remoteRequest.length > 0) {
        var path = createGetRequestPath(remoteRequest, o.display);

        return $http.get(path).success(function(receivers) {

          // Get entries for each team-year pair:
          // Add to local storage:

          for (i = 0; i < remoteRequest.length; i++) {
            var partial = remoteRequest[i].team + "-" + remoteRequest[i].year;

            var selectedReceivers = _.filter(receivers, function(obj) {
              return obj['YEAR'] == remoteRequest[i].year && obj['TEAM'] == remoteRequest[i].team;
            });

            $localStorage.teamyears[partial] = selectedReceivers;
          }

          // Create spie charts for each of the requested team/date pairs.
          var maxYards = getMaxYardsReached(request, $localStorage.teamyears);

          for (i = 0; i < request.length; i++) {
            createSpie(i, request, $localStorage.teamyears, teams, maxYards, o.display[i].receivers);
          }
        });
      } else {
          // Create spie charts for each of the requested team/date pairs.
          var maxYards = getMaxYardsReached(request, $localStorage.teamyears);

          for (i = 0; i < request.length; i++) {
            createSpie(i, request, $localStorage.teamyears, teams, maxYards, o.display[i].receivers);
          }
      }


    };

    return o;
  }
]);

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
      var nextState = 'home.' + $scope.display.length;

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

function createGetRequestPath(request, display) {
  var path = '/receptions';
  for (i = 0; i < request.length; i++) {
    path += "/" + request[i].team + "/" + request[i].year;
  }

  return path;
}

/**
 * For each of the team/year pairs in the request, get the number of total team yards
 * for the team that had most team yards that year.
 * @param  array request   The array of team-year pairs.
 * @param  array receivers Array of all receivers on those team-years.
 */
function getMaxYardsReached(request, teamYearDict) {
  var maxYards = 0;
  for (i = 0; i < request.length; i++) {
    var selectedReceivers = teamYearDict[request[i].team + "-" + request[i].year];

    /*
     * Calculate total yards and receptions to normalize results against this:
     */
    var totalYards = 0;

    for (var num in selectedReceivers) {
      if (selectedReceivers.hasOwnProperty(num)) {
        var receiver = selectedReceivers[num];
        totalYards += parseFloat(receiver['YDS']);
      }
    }

    maxYards = Math.max(maxYards, totalYards);
  }

  return maxYards;

}

function createSpie(i, request, teamYearDict, teams, maxYards, displayForYear) {

  var selectedReceivers = teamYearDict[request[i].team + "-" + request[i].year];


  displayForYear.splice(0, displayForYear.length) // clear array, keep reference
  convertToSpie(selectedReceivers, displayForYear, teams.teams, maxYards);

}

function convertToSpie(receivers, receiversArray, teams, maxYards) {
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

      var chartHeight = Math.max(parseFloat(10), ((receiver['YDS'] / parseFloat(maxYards)) * 100) * 2);

      var percentageYac = Math.min(parseFloat(1), parseFloat(receiver['YAC']) / parseFloat(receiver['YDS']));
      var percentageNonYac = 1.0 - percentageYac;

      var team = _.find(teams, function(obj) {
        return obj.code == receiver['TEAM']
      })
      var primaryColor = team['primarycolor'] === undefined ? "#FFFFFF" : team['primarycolor'];
      var secondaryColor = team['secondarycolor'] === undefined ? "000000" : team['secondarycolor'];

      var maxPlayerHeight = totalYards / maxYards; // make height relative to total max.
      var sliceNonYac = {
        height: chartHeight * percentageNonYac * maxPlayerHeight,
        color: primaryColor,
        highlight: shadeColor(primaryColor, 0.2),
        label: Math.max(0, receiver['YDS'] - receiver['YAC']) + " yards in air"
      };

      var sliceYac = {
        height: chartHeight * percentageYac * maxPlayerHeight,
        color: secondaryColor,
        highlight: shadeColor(secondaryColor, 0.2),
        label: receiver['YAC'] + " yards after catch"
      };

      // Create new player info and add it to the results array:
      receiversArray.push({
        width: Rwidth,
        label: Rlabel,
        slices: [sliceYac, sliceNonYac]
      });
    }
  }

}

// From http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color, percent) {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = f >> 8 & 0x00FF,
    B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}