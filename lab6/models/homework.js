var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Homework',{
  requirement: Schema.Types.ObjectId,  // requirement id
  student: Schema.Types.ObjectId,  // student id
  content: String
});