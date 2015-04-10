var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Requirement',{
  deadline: Date,
  content: String,
  course: Schema.Types.ObjectId,
  name: String
});