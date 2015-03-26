var p = require('./promise.js');

// Adapter for test
// as specified by
// https://github.com/promises-aplus/promises-tests
module.exports = {
  resolved: p.resolve,
  rejected: p.rejected,
  deferred: function() {
    var obj = {};
    var pro = new Promise(function(resolve, reject) {
      obj.resolve = resolve;
      obj.reject = reject;
    });
    obj.promise = pro;
    return obj;
  }
};
