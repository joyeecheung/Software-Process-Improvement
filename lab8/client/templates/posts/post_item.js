Template.postItem.helpers({
  domain: function() {
    var a = $('<a>');
    a.prop('href', this.url);
    return a[0].hostname;
  },

  ownPost: function() {
    return this.userId === Meteor.userId();
  }
});