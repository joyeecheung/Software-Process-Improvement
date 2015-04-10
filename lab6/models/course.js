var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Course',{
  teacher: Schema.Types.ObjectId,
  requirement: [Schema.Types.ObjectId]
});