// Fixture data
if (Requirements.find().count() === 0) {
  var now = new Date().getTime();

  var spiId = Courses.insert({
    name: "软件过程改进",
    code: "spi"
  });

  // create users
  var testId = Accounts.createUser({
    username: 'test',
    email: 'test@test.com',
    password: '123456',
    profile: { name: '蛤丝1号' }
  });
  var test2Id = Accounts.createUser({
    username: 'test2',
    email: 'test2@test.com',
    password: '123456',
    profile: { name: '暴力膜蛤' }
  });
  var test3Id = Accounts.createUser({
    username: 'test3',
    email: 'test3@test.com',
    password: '123456',
    profile: { name: '蛤蛤最棒' }
  });

  Meteor.users.update(testId, {$set: {
    courses: [spiId]
  }});
  Meteor.users.update(test2Id, {$set: {
    courses: [spiId],
    isTeacher: true
  }});
  Meteor.users.update(test3Id, {$set: {
    courses: [spiId]
  }});
  // create requirements and homeworks
  var req1Id = Requirements.insert({
    "content": "你们不要想喜欢弄个大新闻",
    "courseId": spiId,
    "deadline": new Date("2015-07-13"),
    "name": "美国的华莱士"
  });

  var hw1Id = Homeworks.insert({
    "content": "我和华莱士谈笑风生！",
    "grade": 99,
    "requirementId": req1Id,
    "studentId": testId
  });

  var hw2Id = Homeworks.insert({
    "content": "刚才你问我，我可以回答一句「无可奉告」，但是你们又不高兴，我怎么办？！",
    "requirementId": req1Id,
    "studentId": test3Id
  });

  var req2Id = Requirements.insert({
    "content": "蛤蛤蛤蛤",
    "courseId": spiId,
    "deadline": new Date("2015-04-13"),
    "name": "我有必要告诉你们一点人生的经验"
  });

  var hw3Id = Homeworks.insert({
    "content": "我为你们感到拙计呀!",
    "requirementId": req2Id,
    "studentId": testId
  });

  var req3Id = Requirements.insert({
    "content": "识得唔识得啊",
    "courseId": spiId,
    "deadline": new Date("2015-11-13"),
    "name": "还是要提高自己的姿势水平"
  });

  var hw4Id = Homeworks.insert({
    "content": "I'm angry! 这样是不行的！",
    "requirementId": req3Id,
    "studentId": test3Id
  });
}