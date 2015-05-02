Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    if (_.without(fieldNames, 'url', 'title').length > 0)
      return false;

    var errors = validatePost(modifier.$set);
    if (errors.title || errors.url)
      return true;

    var duplicate = Posts.findOne({
      url: modifier.$set.url,
      _id: {$ne: post._id}
    });
    if (duplicate) {
      return true;
    } else {
      return false;
    }

  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    // check logged in
    check(Meteor.userId(), String),
    // check necessary fields
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "You have to fill in title and url for your post");

    // check duplicates
    var duplicate = Posts.findOne({url: postAttributes.url});
    if (duplicate) {
      return {
        postExists: true,
        _id: duplicate._id
      };
    }

    // create new post
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0
    });

    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});

validatePost = function(post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in the title";
  if (!post.url)
    errors.url =  "Please fill in the url";
  return errors;
}