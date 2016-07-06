var app = angular.module('nflStats', ['ui.router']);



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
        receivers: []
      };

      o.receivers = 
      [{
        "label": "James Starks",
        "slices": [{
          "color": "#FFB612",
          "height": 20.49673202614379,
          "highlight": "#F0AE1A",
          "label": "455 yards after catch"
        }, {
          "color": "#203731",
          "height": 0.0,
          "highlight": "#234D42",
          "label": "0 yards in air"
        }],
        "width": 12.35632183908046
      }, {
        "label": "Randall Cobb",
        "slices": [{
          "color": "#FFB612",
          "height": 21.803921568627455,
          "highlight": "#F0AE1A",
          "label": "417 yards after catch"
        }, {
          "color": "#203731",
          "height": 21.542483660130717,
          "highlight": "#234D42",
          "label": "412 yards in air"
        }],
        "width": 22.701149425287355
      }, {
        "label": "Richard Rodgers",
        "slices": [{
          "color": "#FFB612",
          "height": 11.712418300653596,
          "highlight": "#F0AE1A",
          "label": "224 yards after catch"
        }, {
          "color": "#203731",
          "height": 14.954248366013072,
          "highlight": "#234D42",
          "label": "286 yards in air"
        }],
        "width": 16.666666666666664
      }, {
        "label": "Eddie Lacy",
        "slices": [{
          "color": "#FFB612",
          "height": 10,
          "highlight": "#F0AE1A",
          "label": "215 yards after catch"
        }, {
          "color": "#203731",
          "height": 0,
          "highlight": "#234D42",
          "label": "0 yards in air"
        }],
        "width": 5.747126436781609
      }, {
        "label": "James Jones",
        "slices": [{
          "color": "#FFB612",
          "height": 11.032679738562091,
          "highlight": "#F0AE1A",
          "label": "211 yards after catch"
        }, {
          "color": "#203731",
          "height": 35.503267973856204,
          "highlight": "#234D42",
          "label": "679 yards in air"
        }],
        "width": 14.367816091954023
      }, {
        "label": "Davante Adams",
        "slices": [{
          "color": "#FFB612",
          "height": 6.483660130718955,
          "highlight": "#F0AE1A",
          "label": "124 yards after catch"
        }, {
          "color": "#203731",
          "height": 18.771241830065364,
          "highlight": "#234D42",
          "label": "359 yards in air"
        }],
        "width": 14.367816091954023
      }, {
        "label": "Ty Montgomery",
        "slices": [{
          "color": "#FFB612",
          "height": 6.985294117647058,
          "highlight": "#F0AE1A",
          "label": "95 yards after catch"
        }, {
          "color": "#203731",
          "height": 3.0147058823529416,
          "highlight": "#234D42",
          "label": "41 yards in air"
        }],
        "width": 4.310344827586207
      }, {
        "label": "John Kuhn",
        "slices": [{
          "color": "#FFB612",
          "height": 8.571428571428571,
          "highlight": "#F0AE1A",
          "label": "48 yards after catch"
        }, {
          "color": "#203731",
          "height": 1.428571428571429,
          "highlight": "#234D42",
          "label": "8 yards in air"
        }],
        "width": 1.7241379310344827
      }, {
        "label": "Jeff Janis",
        "slices": [{
          "color": "#FFB612",
          "height": 3.670886075949367,
          "highlight": "#F0AE1A",
          "label": "29 yards after catch"
        }, {
          "color": "#203731",
          "height": 6.329113924050633,
          "highlight": "#234D42",
          "label": "50 yards in air"
        }],
        "width": 0.5747126436781609
      }, {
        "label": "Justin Perillo",
        "slices": [{
          "color": "#FFB612",
          "height": 2.1568627450980395,
          "highlight": "#F0AE1A",
          "label": "22 yards after catch"
        }, {
          "color": "#203731",
          "height": 7.8431372549019605,
          "highlight": "#234D42",
          "label": "80 yards in air"
        }],
        "width": 3.1609195402298855
      }, {
        "label": "Jared Abbrederis",
        "slices": [{
          "color": "#FFB612",
          "height": 1.6216216216216217,
          "highlight": "#F0AE1A",
          "label": "18 yards after catch"
        }, {
          "color": "#203731",
          "height": 8.378378378378379,
          "highlight": "#234D42",
          "label": "93 yards in air"
        }],
        "width": 2.586206896551724
      }, {
        "label": "Aaron Ripkowski",
        "slices": [{
          "color": "#FFB612",
          "height": 7.777777777777778,
          "highlight": "#F0AE1A",
          "label": "14 yards after catch"
        }, {
          "color": "#203731",
          "height": 2.2222222222222223,
          "highlight": "#234D42",
          "label": "4 yards in air"
        }],
        "width": 0.28735632183908044
      }, {
        "label": "Andrew Quarless",
        "slices": [{
          "color": "#FFB612",
          "height": 3.225806451612903,
          "highlight": "#F0AE1A",
          "label": "10 yards after catch"
        }, {
          "color": "#203731",
          "height": 6.774193548387098,
          "highlight": "#234D42",
          "label": "21 yards in air"
        }],
        "width": 1.1494252873563218
      }
    ]
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
      $scope.receivers = receivers.receivers;
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