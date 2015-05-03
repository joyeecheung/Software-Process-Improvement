Meteor.subscribe("userData");

Accounts.onLogin(function() {
  Router.go('home');
});