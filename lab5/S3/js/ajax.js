(function() {
  this.util.ajax = (function() {
    'use strict';
    var DONE, OK, core;
    DONE = 4;
    OK = 200;
    core = function(method, url, args) {
      url = url + '?ts=' + Date.now();
      return new Promise(function(resolve, reject) {
        var client;
        client = new XMLHttpRequest;
        client.open(method, url, true);
        client.setRequestHeader('Cache-Control', 'no-cache, no-store');
        util.addEvent(client, 'readystatechange', function(e) {
          var me;
          me = e.target;
          if (me.readyState === DONE) {
            if (me.status === OK) {
              resolve(me.responseText);
            } else {
              reject({
                'error': me.statusText
              });
            }
          }
        });
        client.send(url);
      });
    };
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
  })();

}).call(this);
