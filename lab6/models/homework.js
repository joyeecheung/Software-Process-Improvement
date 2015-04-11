var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var homeworkSchema = new Schema({
  requirement: {
    type: Schema.Types.ObjectId,
    ref: 'Requirement'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: String,
  grade: Number
});

homeworkSchema.plugin(deepPopulate);
var Homework = mongoose.model('Homework', homeworkSchema);
module.exports = Homework;