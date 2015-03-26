;util.ajax = (function() {
  'use strict';
  var DONE = 4,
      OK = 200;

  function core(method, url, args) {
    url = url + '?ts=' + Date.now();  // add time stamp to avoid cache
    // Establishing a promise in return
    return new Promise(function(resolve, reject) {
      // Instantiates the XMLHttpRequest
      var client = new XMLHttpRequest();
      client.open(method, url, true);
      client.setRequestHeader("Cache-Control", "no-cache, no-store");
      util.addEvent(client, 'readystatechange', function(e) {
        var me = e.target;
        if (me.readyState === DONE) {
          if (me.status === OK) {
            resolve(me.response);
          } else {
            reject({
              "error": me.statusText
            });
          }
        }
      });

      client.send(url);
    });
  }

  return {
    'get': function(url, args) {
      return core('GET', url, args);
    },
    'post': function(url, args) {
      return core('POST', url, args);
    },
    'put': function(url, args) {
      return core('PUT', url, args);
    },
    'delete': function(url, args) {
      return core('DELETE', url, args);
    }
  };

}());
