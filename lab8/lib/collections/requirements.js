Requirements = new Mongo.Collection('requirements');
Requirements.allow({
  update: function(userId, requirement) {
    return !!userId;
  },
  insert: function(userId, requirement) {
    return !!userId;
  }
});

Requirements.deny({
  update: function() {
    var user = Meteor.user();
    return !user || !user.isTeacher;
  },
  insert: function() {
    var user = Meteor.user();
    return !user || !user.isTeacher;
  }
});

Meteor.methods({
  requirementInsert: function(requirement) {
    // check logged in
    check(Meteor.userId(), String);
    // check necessary fields
    check(requirement, {
      content: String,
      deadline: Date,
      name: String,
      courseId: String
    });

    var course = Courses.findOne(requirement.courseId);
    if (!course)
      throw new Meteor.Error('invalid-homework', '作业要求必须发布到存在的课程里');

    var errors = validateRequirement(requirement);
    if (!_.isEmpty(errors))
      throw new Meteor.Error('invalid-requirement', "必须提交所有项");

    // create new requirement
    var requirementId = Requirements.insert(requirement);
    return {
      _id: requirementId
    };
  }
});

validateRequirement = function(requirement) {
  var errors = {};
  var fields = {
    'deadline': '截止日期',
    'content': '作业内容',
    'name': '作业名称',
    'courseId': '课程'
  };

  _.each(fields, function(value, key) {
    if (!requirement[key])
      errors[key] = "请填写" + value;
  });
  return errors;
};