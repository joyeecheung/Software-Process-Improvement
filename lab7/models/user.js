var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isTeacher: Boolean
});

userSchema.plugin(deepPopulate);
module.exports = mongoose.model('User', userSchema);
