var mongoose = require('mongoose');

var ReceiverSchema = new mongoose.Schema({
  TEAM: String,
  REC: {type: Number, default: 0},
  TAR: {type: Number, default: 0},
  YDS: {type: Number, default: 0},
  AVG: {type: Number, default: 0},
  TD: {type: Number, default: 0},
  LONG: {type: Number, default: 0},
  "20+": {type: Number, default: 0},
  "YDS/G": {type: Number, default: 0},
  FUM: {type: Number, default: 0},
  YAC: {type: Number, default: 0},
  "1DN": {type: Number, default: 0},
  YEAR: {type: Number, default: 0}
});

mongoose.model('Receiving', ReceiverSchema, 'receiving');