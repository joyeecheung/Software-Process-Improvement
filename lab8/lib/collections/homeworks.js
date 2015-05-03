Homeworks = new Mongo.Collection('homeworks');

Homeworks.allow({
  update: function(userId, homework) {
    return !!userId;
  },
  insert: function(userId, homework) {
    return !!userId;
  }
});

Homeworks.deny({
  update: function(userId, homework, fieldNames, modifier) {
    var user = Meteor.user();
    if (!user)
      return true;

    if (user.isTeacher) {
      if (modifier.$set.studentId) // teacher cannot change student id
        return true;
    } else {  // student cannot modify grade or requirement
      if (modifier.$set && (modifier.$set.grade || modifier.$set.requirementId))
        return true;

      // cannot submit after deadline
      var now = new Date();
      var requirement = Requirements.findOne(homework.requirementId);
      if (requirement.deadline < now)
        return true;
    }
    return false;
  },
  insert: function(userId, homework) {
    var user = Meteor.user();
    if (!user || user.isTeacher)
      return true;

    if (!homework.content || !homework.requirementId || !homework.studentId || homework.grade)
      return true;

    var requirement = Requirements.findOne(homework.requirementId);
    if (!requirement)
      return true;
    if (requirement.deadline < now)
      return true;

    return false;
  }
});

Meteor.methods({
  homeworkInsert: function(homeworkAttributes) {
    // check logged in
    check(Meteor.userId(), String);
    check(homeworkAttributes, {
      content: String,
      requirementId: String
    });

    var user = Meteor.user();
    var now = new Date();
    var requirement = Requirements.findOne(homeworkAttributes.requirementId);
    if (!requirement)
      throw new Meteor.Error('invalid-homework', '作业必须提交到存在的作业要求下');
    if (requirement.deadline < now) // cannot submit after deadline
      throw new Meteor.Error('invalid-homework', '超过截止日期');

    homework = _.extend(homeworkAttributes, {
      studentId: user._id
    });

    // check duplicates
    var duplicate = Homeworks.findOne({
      studentId: user._id,
      requirementId: homework.requirementId
    });
    if (duplicate)
      throw new Meteor.Error('invalid-homework', '已经提交过作业');

    return Homeworks.insert(homework);
  }
});