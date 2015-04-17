var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var requirementSchema = new Schema({
  deadline: Date,
  content: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  homeworks: [{
    type: Schema.Types.ObjectId,
    ref: 'Homework'
  }],
  name: String
});

requirementSchema.plugin(deepPopulate);
module.exports = mongoose.model('Requirement', requirementSchema);