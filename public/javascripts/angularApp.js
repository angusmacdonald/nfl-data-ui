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
          postPromise: ['posts',
            function(posts) {
              return posts.getAll();
            }
          ]
        }
      });
    $stateProvider
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts',
            function($stateParams, posts) {
              return posts.get($stateParams.id);
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
        "short": "gbp",
        "name": "Green Bay Packers"
      }, {
        "short": "dco",
        "name": "Dallas Cowboys"
      }
    ]



    return o;
  });


app.factory('receivers', function() {

    var o = {
        players: []
      };


      var receivers = 
      [
        { "PLAYER" : "James Starks", "TEAM" : "GB", "REC" : 43, "TAR" : 53, "YDS" : 392, "AVG" : 9.1, "TD" : 3, "LONG" : 30, "20+" : 4, "YDS/G" : 24.5, "FUM" : 1, "YAC" : 455, "1DN" : 15, "YEAR" : 2015 },
{ "PLAYER" : "Randall Cobb", "TEAM" : "GB", "REC" : 79, "TAR" : 129, "YDS" : 829, "AVG" : 10.5, "TD" : 6, "LONG" : 53, "20+" : 11, "YDS/G" : 51.8, "FUM" : 0, "YAC" : 417, "1DN" : 42, "YEAR" : 2015 },
{ "PLAYER" : "Richard Rodgers", "TEAM" : "GB", "REC" : 58, "TAR" : 85, "YDS" : 510, "AVG" : 8.8, "TD" : 8, "LONG" : 61, "20+" : 6, "YDS/G" : 31.9, "FUM" : 0, "YAC" : 224, "1DN" : 27, "YEAR" : 2015 },
{ "PLAYER" : "Eddie Lacy", "TEAM" : "GB", "REC" : 20, "TAR" : 28, "YDS" : 188, "AVG" : 9.4, "TD" : 2, "LONG" : 28, "20+" : 4, "YDS/G" : 12.5, "FUM" : 1, "YAC" : 215, "1DN" : 7, "YEAR" : 2015 },
{ "PLAYER" : "James Jones", "TEAM" : "GB", "REC" : 50, "TAR" : 100, "YDS" : 890, "AVG" : 17.8, "TD" : 8, "LONG" : 65, "20+" : 18, "YDS/G" : 55.6, "FUM" : 1, "YAC" : 211, "1DN" : 39, "YEAR" : 2015 },
{ "PLAYER" : "Davante Adams", "TEAM" : "GB", "REC" : 50, "TAR" : 93, "YDS" : 483, "AVG" : 9.7, "TD" : 1, "LONG" : 40, "20+" : 6, "YDS/G" : 37.2, "FUM" : 0, "YAC" : 124, "1DN" : 20, "YEAR" : 2015 },
{ "PLAYER" : "Ty Montgomery", "TEAM" : "GB", "REC" : 15, "TAR" : 18, "YDS" : 136, "AVG" : 9.1, "TD" : 2, "LONG" : 31, "20+" : 1, "YDS/G" : 22.7, "FUM" : 0, "YAC" : 95, "1DN" : 6, "YEAR" : 2015 },
{ "PLAYER" : "John Kuhn", "TEAM" : "GB", "REC" : 6, "TAR" : 10, "YDS" : 56, "AVG" : 9.3, "TD" : 0, "LONG" : 19, "20+" : 0, "YDS/G" : 3.5, "FUM" : 0, "YAC" : 48, "1DN" : 3, "YEAR" : 2015 },
{  "PLAYER" : "Jeff Janis", "TEAM" : "GB", "REC" : 2, "TAR" : 11, "YDS" : 79, "AVG" : 39.5, "TD" : 0, "LONG" : 46, "20+" : 2, "YDS/G" : 4.9, "FUM" : 0, "YAC" : 29, "1DN" : 2, "YEAR" : 2015 },
{  "PLAYER" : "Justin Perillo", "TEAM" : "GB", "REC" : 11, "TAR" : 13, "YDS" : 102, "AVG" : 9.3, "TD" : 1, "LONG" : 24, "20+" : 2, "YDS/G" : 11.3, "FUM" : 0, "YAC" : 22, "1DN" : 5, "YEAR" : 2015 },
{  "PLAYER" : "Jared Abbrederis", "TEAM" : "GB", "REC" : 9, "TAR" : 16, "YDS" : 111, "AVG" : 12.3, "TD" : 0, "LONG" : 32, "20+" : 1, "YDS/G" : 11.1, "FUM" : 1, "YAC" : 18, "1DN" : 5, "YEAR" : 2015 },
{ "PLAYER" : "Aaron Ripkowski", "TEAM" : "GB", "REC" : 1, "TAR" : 1, "YDS" : 18, "AVG" : 18, "TD" : 0, "LONG" : 18, "20+" : 0, "YDS/G" : 1.2, "FUM" : 0, "YAC" : 14, "1DN" : 1, "YEAR" : 2015 },
{ "PLAYER" : "Andrew Quarless", "TEAM" : "GB", "REC" : 4, "TAR" : 5, "YDS" : 31, "AVG" : 7.8, "TD" : 0, "LONG" : 13, "20+" : 0, "YDS/G" : 6.2, "FUM" : 0, "YAC" : 10, "1DN" : 1, "YEAR" : 2015 } ];

  var totalReceptionNumbers = 0;
  var totalYards = 0;

  for(var num in receivers) {
    if(receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];
      totalReceptionNumbers += parseFloat( receiver['REC'] );
      totalYards += parseFloat( receiver['YDS'] );
    }
  }


for(var num in receivers) {
    if(receivers.hasOwnProperty(num)) {
      var receiver = receivers[num];

      var Rwidth = (receiver['REC'] / parseFloat(totalReceptionNumbers)) * 100;
      var Rlabel = receiver['PLAYER'];

      var chartHeight = Math.max(parseFloat(10), ((receiver['YDS'] / parseFloat(totalYards)) * 100) * 2);
      
      var percentageYac = Math.min (parseFloat(1), parseFloat(receiver['YAC']) / parseFloat(receiver['YDS']));
      var percentageNonYac = 1.0- percentageYac;

      
      var sliceNonYac = {
        height: chartHeight * percentageNonYac,
        color: "#203731",
        highlight: "#234D42",
        label: Math.max(0, receiver['YDS']-receiver['YAC']) + " yards in air"
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

    return o;
  });



  app.factory('posts', ['$http',
    function($http) {
      var o = {
        posts: []
      };

      o.getAll = function() {
        return $http.get('/posts').success(function(data) {
          angular.copy(data, o.posts);
        });
      };

      o.create = function(post) {
        return $http.post('/posts', post).success(function(data) {
          o.posts.push(data);
        });
      };
      o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote')
          .success(function(data) {
            post.upvotes += 1;
          });
      };


      o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res) {
          return res.data;
        });
      };
      o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
          .success(function(data) {
            comment.upvotes += 1;
          });
      };

      o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);

      };

      return o;
    }
  ]);


  app.controller('MainCtrl', [
    '$scope',
    'posts',
    'receivers',
    'teams',
    function($scope, posts, receivers, teams) {
      $scope.posts = posts.posts;
      $scope.players = receivers.players;
      $scope.teams = teams.teams;
      $scope.selectedTeam = null;

      $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') {
          return;
        }
        posts.create({
          title: $scope.title,
          link: $scope.link,
        });
        $scope.title = '';
        $scope.link = '';
      };

      $scope.incrementUpvotes = function(post) {
        posts.upvote(post);
      };
    }
  ]);

  app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post) {
      $scope.post = post;

      $scope.addComment = function() {
        if ($scope.body === '') {
          return;
        }
        posts.addComment(post._id, {
          body: $scope.body,
          author: 'user',
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });
        $scope.body = '';
      };

      $scope.incrementUpvotes = function(comment) {
        posts.upvoteComment(post, comment);
      };


    }
  ]);