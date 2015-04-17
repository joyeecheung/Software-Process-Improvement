var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var courseSchema = new Schema({
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  requirements: [{
    type: Schema.Types.ObjectId,
    ref: 'Requirement'
  }],
  name: String
});

courseSchema.plugin(deepPopulate);
module.exports = mongoose.model('Course',courseSchema);