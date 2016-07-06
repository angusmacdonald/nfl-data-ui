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
        {  "PLAYER" : "Willis McGahee", "TEAM" : "BUF", "REC" : 28, "TAR" : 0, "YDS" : 178, "AVG" : 6.4, "TD" : 0, "LONG" : 19, "20+" : 0, "YDS/G" : 11.1, "FUM" : 0, "YAC" : 0, "1DN" : 10, "YEAR" : 2005 },
{  "PLAYER" : "Sam Aiken", "TEAM" : "BUF", "REC" : 4, "TAR" : 0, "YDS" : 57, "AVG" : 14.3, "TD" : 0, "LONG" : 22, "20+" : 1, "YDS/G" : 3.6, "FUM" : 0, "YAC" : 0, "1DN" : 3, "YEAR" : 2005 }
    ];

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