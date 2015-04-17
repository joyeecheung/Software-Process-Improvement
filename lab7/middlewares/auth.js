exports.isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

exports.isTeacher = function(req, res, next) {
  if(req.user.isTeacher)
    return next();

  res.status(403).end();
}

exports.isStudent = function(req, res, next) {
  if(!req.user.isTeacher)
    return next();

  res.status(403).end();
}

exports.isAuthenticatedAPI = function(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.status(401).end();
}