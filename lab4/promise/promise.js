/**
 * Promise/A+ polyfill for the browser and node.
 */
(function() {
  'use strict';

  var root;
  if (typeof window === 'object' && window) {
    root = window; // browser
  } else {
    root = global; // node, .etc.
  }

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  // Polyfill for isArray
  var isArray = Array.isArray || function(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };

  // Polyfill for setImmediate for performance
  var asap = Promise.immediateFn || root.setImmediate || function(fn) {
    setTimeout(fn, 1);
  };

  var FULLFILLED = true,
      REJECTED = false;

  function handle(deferred) {
    var that = this;

    if (this._state === null) {
      this._deferreds.push(deferred);
      return;
    }

    asap(function() {
      var cb = that._state ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        // pass down
        (that._state ? deferred.resolve : deferred.reject)(that._value);
        return;
      }

      var ret;
      try {
        ret = cb(that._value);
      } catch (e) {
        deferred.reject(e);
        return;
      }

      // pass down
      deferred.resolve(ret);
    });
  }

  function resolve(newValue) {
    try {
      if (newValue === this)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' ||
                       typeof newValue === 'function')) {
        var then = newValue.then;
        if (typeof then === 'function') { // thenable
          doResolve(bind(then, newValue),
                    bind(resolve, this),
                    bind(reject, this));
          return;
        }
      }

      this._state = FULLFILLED;
      this._value = newValue;
      finalize.call(this);
    } catch (e) {
      reject.call(this, e);
    }
  }

  function reject(newValue) {
    this._state = REJECTED;
    this._value = newValue;
    finalize.call(this);
  }

  function finalize() {
    for (var i = 0, len = this._deferreds.length; i < len; i++) {
      handle.call(this, this._deferreds[i]);
    }
    this._deferreds = null;
  }

  function Deferred(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
  }

  function doResolve(fn, onFulfilled, onRejected) {
    // Make sure onFulfilled and onRejected are only called once
    var done = false;
    try {
      fn(function(value) {
        if (done) return;
        done = true;
        onFulfilled(value);
      }, function(reason) {
        if (done) return;
        done = true;
        onRejected(reason);
      });
    } catch (e) {
      if (done) return;
      done = true;
      onRejected(e);
    }
  }

  function Promise(fn) {
    if (typeof this !== 'object')
      throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function')
      throw new TypeError('Argument is not callable');

    this._state = null;
    this._value = null;
    this._deferreds = [];

    doResolve(fn, bind(resolve, this), bind(reject, this));
  }

  // avoid explicit catch here since it is reserved in IE9-
  Promise.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function(onFulfilled, onRejected) {
    var that = this;
    return new Promise(function(resolve, reject) {
      // attach a new Deferred
      handle.call(that, new Deferred(onFulfilled, onRejected, resolve, reject));
    });
  };

  Promise.all = function() {
    var toSlice;
    if (arguments.length === 1 && isArray(arguments[0]))
      toSlice = arguments[0];
    else
      toSlice = arguments;
    var args = Array.prototype.slice.call(toSlice);

    return new Promise(function(resolve, reject) {
      if (args.length === 0)
        return resolve([]);  // empty promise
      var remaining = args.length;

      function start(i, value) {
        try {
          if (value && (typeof value === 'object' ||
                        typeof value === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {  // thenable
              then.call(val, function(nextValue) {
                start(i, nextValue);  // then until not thenable
              }, reject);
              return;
            }
          }
          args[i] = val;  // replace with return values
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (e) {
          reject(e);
        }
      }

      // test all promises
      for (var i = 0; i < args.length; i++) {
        start(i, args[i]);
      }
    });
  };

  Promise.resolve = function(value) {
    if (value && typeof value === 'object' &&
        value.constructor === Promise) {
      return value;
    }

    return new Promise(function(resolve) {
      resolve(value);
    });
  };

  Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function(values) {
    return new Promise(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // fill
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})();
