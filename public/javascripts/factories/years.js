var app = angular.module('nflStats');

/**
 * Operations for obtaining valid years over which to query:
 */
app.factory('years', function() {

  var o = {
    years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]
  };

  return o;
});