var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var Receiving = mongoose.model('Receiving');
var Team = mongoose.model('Team');

router.get('/receptions/:teamA/:yearA/:teamB?/:yearB?/:teamC?/:yearC?', function(req, res, next) {
  Receiving.
  find({  $or: [
                { 'TEAM': req.params['teamA'], 'YEAR': req.params['yearA'] },
                { 'TEAM': req.params['teamB'], 'YEAR': req.params['yearB'] },
                { 'TEAM': req.params['teamC'], 'YEAR': req.params['yearC'] }
            ]}
            ).
  exec(function(err, receiving){
    if(err){ return next(err); }

    res.json(receiving);
  });
});

router.get('/teams', function(req, res, next) {
  Team.
  find({}).exec(function(err, team){
    if(err){ return next(err); }

    res.json(team);
  });
});