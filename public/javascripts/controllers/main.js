var app = angular.module('nflStats');

app.controller('MainCtrl', [
  '$scope',
  '$state',
  'receivers',
  'teams',
  'years',
  function($scope, $state, receivers, teams, years) {
    $scope.teams = teams.teams;
    $scope.years = years.years;

    // Container for  reception data:
    $scope.display = receivers.display;



    // Chart options:
    $scope.options = {
      responsive: true
    };

    $scope.updateDisplay = function() {
      // Change the URL, initiating a new request.
      var nextState = 'home' + (($scope.display.length > 1) ? "." + $scope.display.length : "");

      // Create query parameters from all defined team-year pairs:
      var params = {};

      for (i = 0; i < $scope.display.length; i++) {
        var letter = String.fromCharCode(65 + i);
        params['team' + letter] = $scope.display[i].selectedTeam;
        params['year' + letter] = $scope.display[i].selectedYear;
      }

      $state.go(nextState, params);
    };

    $scope.removeEntry = function(selectedTeam, selectedYear) {
      $scope.display = _.without($scope.display, _.findWhere(
        $scope.display, {
          'selectedTeam': selectedTeam,
          'selectedYear': selectedYear
        }
      ));

      $scope.updateDisplay();
    };

    $scope.addEntry = function(selectedTeam, selectedYear) {
      $scope.display.push({
        'selectedTeam': selectedTeam,
        'selectedYear': selectedYear
      });

      $scope.updateDisplay();
    };
  }
]);