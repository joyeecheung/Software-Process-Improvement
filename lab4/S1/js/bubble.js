;
(function() {
  'use strict';

  util.addEvent(window, 'load', function() {
    setInterval(function() {
      util.ajax.get('/').then(function(res) {
        console.log('ok:' + res.toString());
      }, function(res) {
        console.log('err:' + res.toString());
      });
    }, 2000);
  });

}());
