var app = angular.module('nflStats');

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