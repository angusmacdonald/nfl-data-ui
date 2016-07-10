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

    $scope.styleToUse = function(){
      var length = $scope.display.length;

      if (length == 1){
        return "col-md-12";
      } else if (length == 2){
        return "col-md-6";
      } else {
        return "col-md-4";
      }
    };
  }
]);
