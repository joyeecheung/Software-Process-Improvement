Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  requestPermissions: {},
  extraSignupFields: [{
    fieldName: 'name',
    fieldLabel: 'Nickname',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your nick Name");
        return false;
      } else {
        return true;
      }
    }
  }]
});

Accounts.onLogin(function() {
  Router.go('home');
});
