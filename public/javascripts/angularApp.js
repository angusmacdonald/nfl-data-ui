var app = angular.module('nflStats', ['ui.router', 'tc.chartjs']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/receiving/:teamA/:yearA/:teamB/:yearB/:teamC/:yearC',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          // Get data on page load:
          resolveTeams: ['teams',
            function(teams) {
              return teams.getTeams();
            }
          ],
          resolveReceivers: ['$stateParams', 'receivers',
            function($stateParams, receivers) {
              request = [{
                team: $stateParams['teamA'],
                year: $stateParams['yearA']
              }, {
                team: $stateParams['teamB'],
                year: $stateParams['yearB']
              }, {
                team: $stateParams['teamC'],
                year: $stateParams['yearC']
              }, ];
              return receivers.getRequestedReceivers(request);
            }
          ]
        }
      });

    $urlRouterProvider.otherwise('receiving/GB/2013/GB/2014/GB/2015');
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
app.factory('receivers', ['$http', 'teams',
  function($http, teams) {

    var o = {
      display: [{
        selectedTeam: "GB",
        selectedYear: 2013,
        receivers: []
      }, {
        selectedTeam: "GB",
        selectedYear: 2014,
        receivers: []
      }, {
        selectedTeam: "GB",
        selectedYear: 2015,
        receivers: []
      }, ]
    };

    o.getRequestedReceivers = function(request) {
      var path = createGetRequestPath(request, o.display);

      return $http.get(path).success(function(receivers) {
        // Create spie charts for each of the requested team/date pairs.
        var maxYards = getMaxYardsReached(request, receivers);

        for (i = 0; i < request.length; i++) {
          createSpie(i, request, receivers, teams, maxYards, o.display[i].receivers);
        }
      });
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
      $state.go('home', {
        teamA: $scope.display[0].selectedTeam,
        yearA: $scope.display[0].selectedYear,
        teamB: $scope.display[1].selectedTeam,
        yearB: $scope.display[1].selectedYear,
        teamC: $scope.display[2].selectedTeam,
        yearC: $scope.display[2].selectedYear
      });
    };
  }
]);

function createGetRequestPath(request, display) {
  var path = '/receiving';
  for (i = 0; i < request.length; i++) {
    path += "/" + request[i].team + "/" + request[i].year;
    display[i].selectedTeam = request[i].team;
    display[i].selectedYear = request[i].year;
  }

  return path;
}

/**
 * For each of the team/year pairs in the request, get the number of total team yards 
 * for the team that had most team yards that year.
 * @param  array request   The array of team-year pairs.
 * @param  array receivers Array of all receivers on those team-years.
 */
function getMaxYardsReached(request, receivers) {
  var maxYards = 0;
  for (i = 0; i < request.length; i++) {
    var selectedReceivers = _.filter(receivers, function(obj) {
      return obj['YEAR'] == request[i].year && obj['TEAM'] == request[i].team;
    })

    /*
     * Calculate total yards and receptions to normalize results against this:
     */
    var totalYards = 0;

    for (var num in selectedReceivers) {
      if (receivers.hasOwnProperty(num)) {
        var receiver = receivers[num];
        totalYards += parseFloat(receiver['YDS']);
      }
    }

    maxYards = Math.max(maxYards, totalYards);
  }

  return maxYards;

}

function createSpie(i, request, receivers, teams, maxYards, displayForYear) {

  var selectedReceivers = _.filter(receivers, function(obj) {
    return obj['YEAR'] == request[i].year && obj['TEAM'] == request[i].team;
  })

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

      var maxPlayerHeight = (totalYards / maxYards) * 0.8; // make height relative to total max.
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