Meteor.publish('posts', function() {
  return Posts.find();
});


Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'foo': 1}});
  } else {
    this.ready();
  }
});