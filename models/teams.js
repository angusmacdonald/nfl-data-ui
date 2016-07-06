var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  code: String,
  name: String,
  primarycolor: String,
  secondarycolor: String
});

mongoose.model('Team', TeamSchema, 'teams');