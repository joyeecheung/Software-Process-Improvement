(function() {
  (function(d) {
    'use strict';
    var ABORT, AUTO, FAIL_RATE, RANDOM_FAIL, aHandler, apb, atplus, autoCalculate, autoload, bHandler, bubbleHandler, buttons, cHandler, calculate, checkInfo, clickButton, dHandler, eHandler, errorHandler, handleButton, info, init, marks, msgtext, numButtons, randomBreak, seqtext, startPending, stopPending, sum, total;
    atplus = d.getElementById('at-plus-container');
    apb = d.getElementsByClassName('apb')[0];
    buttons = atplus.getElementsByClassName('button');
    msgtext = d.getElementById('message');
    info = d.getElementById('info-bar');
    total = d.getElementById('total');
    seqtext = d.getElementById('sequence');
    marks = {};
    numButtons = buttons.length;
    AUTO = true;
    FAIL_RATE = 0.3;
    ABORT = 1;
    RANDOM_FAIL = 2;
    sum = function(obj) {
      var i, ret;
      ret = 0;
      for (i in obj) {
        ret += parseInt(obj[i]);
      }
      return ret;
    };
    startPending = function(button, auto) {
      var i, j, random, ref;
      if (util.hasClass(button, 'disabled')) {
        return;
      }
      random = button.getElementsByClassName('random')[0];
      random.innerHTML = '...';
      util.addClass(random, 'show');
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        util.removeEvent(buttons[i], 'click', handleButton);
        if (buttons[i] !== button) {
          util.addClass(buttons[i], 'disabled');
        }
      }
    };
    stopPending = function(button, number, auto) {
      var i, j, rand, random, ref;
      random = button.getElementsByClassName('random')[0];
      random.innerHTML = number;
      util.addClass(button, 'disabled');
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        rand = buttons[i].getElementsByClassName('random')[0];
        if (buttons[i] !== button && !util.hasClass(rand, 'show')) {
          if (!auto) {
            util.addEvent(buttons[i], 'click', handleButton);
          }
          util.removeClass(buttons[i], 'disabled');
        }
      }
    };
    checkInfo = function() {
      var i, j, ref;
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (!util.hasClass(buttons[i], 'disabled')) {
          return;
        }
      }
      util.addEvent(info, 'click', calculate);
      util.removeClass(info, 'disabled');
    };
    calculate = function() {
      total.innerHTML = sum(marks);
      util.removeEvent(info, 'click', calculate);
      util.addClass(info, 'disabled');
    };
    handleButton = function(e) {
      var button, promise;
      button = e.currentTarget;
      promise = new Promise(function(resolve, reject) {
        startPending(button);
        util.ajax.get('/').then(function(number) {
          resolve(number);
        });
        util.addEvent(atplus, 'mouseleave', function(e) {
          reject('abort promise due to mouseleave');
        });
      }).then(function(number) {
        stopPending(button, number);
        util.removeEvent(button, handleButton);
        marks[button.id] = number;
        checkInfo();
      });
    };
    autoCalculate = function(currentSum) {
      total.innerHTML = currentSum;
      util.addClass(info, 'disabled');
    };
    clickButton = function(button, currentSum, auto) {
      return new Promise(function(resolve, reject) {
        startPending(button, auto);
        util.ajax.get('/').then(function(number) {
          resolve(number);
        });
        util.addEvent(atplus, 'mouseleave', function(e) {
          reject({
            message: 'abort promise due to mouseleave',
            error: ABORT
          });
        });
      }).then(function(number) {
        stopPending(button, number, AUTO);
        util.removeEvent(button, handleButton);
        return currentSum + parseInt(number);
      });
    };
    randomBreak = function(i, message, currentSum) {
      if (Math.random() < FAIL_RATE) {
        return Promise.reject({
          message: message,
          currentSum: currentSum
        });
      } else {
        msgtext.innerHTML = message;
        if (i < 5) {
          return clickButton(buttons[i], currentSum, AUTO);
        } else {
          return Promise.resolve(currentSum);
        }
      }
    };
    aHandler = function(currentSum) {
      return randomBreak(0, '这是个天大的秘密', currentSum);
    };
    bHandler = function(currentSum) {
      return randomBreak(1, '我不知道', currentSum);
    };
    cHandler = function(currentSum) {
      return randomBreak(2, '你不知道', currentSum);
    };
    dHandler = function(currentSum) {
      return randomBreak(3, '他不知道', currentSum);
    };
    eHandler = function(currentSum) {
      return randomBreak(4, '才怪', currentSum);
    };
    bubbleHandler = function(currentSum) {
      return randomBreak(5, '楼主异步调用战斗力感人, 目测不超过' + currentSum, currentSum).then(autoCalculate).then(function() {
        util.addEvent(apb, 'click', autoload);
        util.removeClass(apb, 'disabled');
      });
    };
    errorHandler = function(reason) {
      var negation;
      if (reason.error === ABORT) {
        console.log(reason.message);
        util.addEvent(apb, 'click', autoload);
        util.removeClass(apb, 'disabled');
        return;
      }
      negation = {
        '这是个天大的秘密': '这不是个天大的秘密',
        '我不知道': '我知道',
        '你不知道': '你知道',
        '他不知道': '他知道',
        '才怪': '才不怪'
      };
      if (negation[reason.message]) {
        msgtext.innerHTML = negation[reason.message];
      } else {
        msgtext.innerHTML = reason.message.replace('目测不超过', '目测超过');
        autoCalculate(reason.currentSum);
      }
      util.addClass(msgtext, 'failed');
      util.addEvent(apb, 'click', autoload);
      util.removeClass(apb, 'disabled');
      return reason.currentSum;
    };
    autoload = function(e) {
      var dict, handlers, i, j, promise, ref, seq, text;
      init(e, AUTO);
      util.removeEvent(apb, 'click', autoload);
      util.addClass(apb, 'disabled');
      seq = util.shuffle((function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          results.push(i);
        }
        return results;
      })());
      dict = ['A', 'B', 'C', 'D', 'E'];
      text = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = seq.length; j < len; j++) {
          i = seq[j];
          results.push(dict[i]);
        }
        return results;
      })()).join(', ');
      seqtext.innerHTML = text;
      handlers = [aHandler, bHandler, cHandler, dHandler, eHandler];
      promise = void 0;
      for (i = j = 0, ref = numButtons; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (typeof promise === 'undefined') {
          promise = handlers[seq[i]](0);
        } else {
          promise = promise.then(handlers[seq[i]]);
        }
      }
      promise.then(bubbleHandler)['catch'](errorHandler);
    };
    init = function(e, auto) {
      var i, j, random, ref;
      if (!auto) {
        marks = {};
      }
      total.innerHTML = '';
      seqtext.innerHTML = '';
      msgtext.innerHTML = '';
      util.removeClass(msgtext, 'failed');
      util.removeEvent(info, 'click', calculate);
      util.addClass(info, 'disabled');
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        random = buttons[i].getElementsByClassName('random')[0];
        util.removeClass(random, 'show');
        if (!auto) {
          util.addEvent(buttons[i], 'click', handleButton);
          marks[buttons[i].id] = null;
        } else {
          util.removeEvent(buttons[i], 'click', handleButton);
        }
        util.removeClass(buttons[i], 'disabled');
      }
    };
    return util.addEvent(window, 'load', function() {
      util.addEvent(atplus, 'mouseenter', init);
      util.addEvent(apb, 'click', autoload);
    });
  })(document);

}).call(this);
