var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var deepPopulate = require('mongoose-deep-populate');

Schema = mongoose.Schema;

var userSchema = new Schema({username: String,password: String,email: String,firstName: String,lastName: String,courses: [{type: Schema.Types.ObjectId,ref: 'Course'}],isTeacher: Boolean});
userSchema.plugin(deepPopulate);
User = mongoose.model('User', userSchema);

var courseSchema = new Schema({teacher: {type: Schema.Types.ObjectId,ref: 'User'},requirements: [{type: Schema.Types.ObjectId,ref: 'Requirement'}],name: String});
courseSchema.plugin(deepPopulate);
Course = mongoose.model('Course',courseSchema);

var requirementSchema = new Schema({deadline: Date, content: String, course: {type: Schema.Types.ObjectId, ref: 'Course'}, homeworks: [{type: Schema.Types.ObjectId, ref: 'Homework'}], name: String });
requirementSchema.plugin(deepPopulate);
Requirement = mongoose.model('Requirement', requirementSchema);

var homeworkSchema = new Schema({requirement: {type: Schema.Types.ObjectId,ref: 'Requirement'},student: {type: Schema.Types.ObjectId,ref: 'User'},content: String,grade: Number});
homeworkSchema.plugin(deepPopulate);
Homework = mongoose.model('Homework', homeworkSchema);

var r = new Requirement({deadline: new Date().setMonth(5), content: "用Express写一个作业管理系统", name: "一个作业管理系统"})
var c = new Course({name: '软件过程改进', requirements:[r._id]});
r.course = c._id;
var h = new Homework({requirement: r, content:"老师我没时间写啊啊啊"})

r.save(function(err) {c.save(function(err){h.save(function(err) {});});});

User.findOne({username: "test"}, function(err, user) {
  user.update({$set: {courses: [c._id]}}, function(err) {
    Homework.update({_id: h._id}, {$set: {student: user._id}}, function(err) {
      Requirement.update({_id: r._id},{$set: {homeworks: [h._id]}}, function(){
      })
    });
  });
});

var u;
User.findOne({username: "test"}, function(err, user) {
  user.deepPopulate('courses.requirements.homeworks', function() {
    u = user;
  })
});

});

Course.find().deepPopulate('requirements.homeworks.student').exec(function(err, user) {
  u = user;
});
var r = new Requirement({name})
Course.find(function(err, c) {console.log(c)});
User.findOne({username: 'test'}, function(err, user) {console.log(user)})
User.findOne({username: 'test'}).populate('course'), function(err, user) {console.log(user)})