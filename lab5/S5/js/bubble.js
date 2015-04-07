;
(function(d) {
  'use strict';
  var atplus = d.getElementById('at-plus-container');
  var apb = d.getElementsByClassName('apb')[0];
  var buttons = atplus.getElementsByClassName('button');
  var msgtext = d.getElementById('message');
  var info = d.getElementById('info-bar');
  var total = d.getElementById('total');
  var seqtext = d.getElementById('sequence');
  var marks = {};  // for non-auto calls

  var numButtons = buttons.length;
  var AUTO = true;
  var FAIL_RATE = 0.3;
  var ABORT = 1, RANDOM_FAIL = 2;

  function sum(obj) {
    var ret = 0;
    for (var i in obj) {
      ret += parseInt(obj[i]);
    }
    return ret;
  }

  function startPending(button, auto) {
    // check if it is disabled
    if (util.hasClass(button, 'disabled'))
      return;

    // show ... in button
    var random = button.getElementsByClassName('random')[0];
    random.innerHTML = '...'
    util.addClass(random, 'show');

    // disable other buttons
    for (var i = 0; i < numButtons; ++i) {
      util.removeEvent(buttons[i], 'click', handleButton);
      if (buttons[i] !== button) {
        util.addClass(buttons[i], 'disabled');
      }
    }
  }

  function stopPending(button, number, auto) {
    // show the number
    var random = button.getElementsByClassName('random')[0];
    random.innerHTML = number;

    // disable this button
    util.addClass(button, 'disabled');

    // enable other buttons
    for (var i = 0; i < numButtons; ++i) {
      var rand = buttons[i].getElementsByClassName('random')[0];
      if (buttons[i] !== button && !util.hasClass(rand, 'show')) {
        if (!auto)
          util.addEvent(buttons[i], 'click', handleButton);
        util.removeClass(buttons[i], 'disabled');
      }
    }
  }

  function checkInfo() {
    // See if there is anyone without number
    for (var i = 0; i < numButtons; ++i) {
      if (!util.hasClass(buttons[i], 'disabled')) return;
    }
    // attach event hanlder
    util.addEvent(info, 'click', calculate);
    util.removeClass(info, 'disabled');
  }

  // for manual calls
  function calculate() {
    for (var i in marks) {
      if (marks[i] === null) return;
    }

    total.innerHTML = sum(marks);
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');
  }

  // for manual calls
  function handleButton(e) {
    var button = e.currentTarget;
    var promise = new Promise(function(resolve, reject) {
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
  }

  // for auto calls
  function autoCalculate(currentSum) {
    total.innerHTML = currentSum;
    util.addClass(info, 'disabled');
  }

  // for auto calls
  function clickButton(button, currentSum, auto) {
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
  }

  function randomBreak(i, message, currentSum) {
    if (Math.random() < FAIL_RATE) {
      return Promise.reject({message: message, currentSum: currentSum});
    } else {
      msgtext.innerHTML = message;
      if (i < 5)
        return clickButton(buttons[i], currentSum, AUTO);
      else
        return Promise.resolve(currentSum);
    }
  }

  function aHandler(currentSum) {
    return randomBreak(0, "这是个天大的秘密", currentSum);
  }

  function bHandler(currentSum) {
    return randomBreak(1, "我不知道", currentSum);
  }

  function cHandler(currentSum) {
    return randomBreak(2, "你不知道", currentSum);
  }

  function dHandler(currentSum) {
    return randomBreak(3, "他不知道", currentSum);
  }

  function eHandler(currentSum) {
    return randomBreak(4, "才怪", currentSum);
  }

  function bubbleHandler(currentSum) {
    return randomBreak(5, "楼主异步调用战斗力感人, 目测不超过" + currentSum,
                       currentSum)
           .then(autoCalculate)
           .then(function() {
              util.addEvent(apb, 'click', autoload);
              util.removeClass(apb, 'disabled');
            });
  }

  function errorHandler(reason) {
    if (reason.error === ABORT) {
      console.log(reason.message);
      util.addEvent(apb, 'click', autoload);
      util.removeClass(apb, 'disabled');
      return;
    }

    var negation = {
      "这是个天大的秘密": "这不是个天大的秘密",
      "我不知道": "我知道",
      "你不知道": "你知道",
      "他不知道": "他知道",
      "才怪": "才不怪"
    };

    if (negation[reason.message]) {
      msgtext.innerHTML = negation[reason.message];
    } else {
      msgtext.innerHTML = reason.message.replace("目测不超过", "目测超过");
      autoCalculate(reason.currentSum);
    }

    util.addClass(msgtext, 'failed');
    util.addEvent(apb, 'click', autoload);
    util.removeClass(apb, 'disabled');

    return reason.currentSum;
  }

  function autoload(e) {
    init(e, AUTO);
    util.removeEvent(apb, 'click', autoload);  // stop racing
    util.addClass(apb, 'disabled');

    var seq = [];
    for (i = 0; i < numButtons; ++i) {
      seq.push(i);
    }
    
    var dict = ['A', 'B', 'C', 'D', 'E'];
    seq = util.shuffle(seq);

    var text = seq.map(function(i){ return dict[i]; }).join(', ');
    seqtext.innerHTML = text;

    var handlers = [aHandler, bHandler, cHandler, dHandler, eHandler];

    var promise;
    for (var i = 0; i < numButtons; ++i) {
      if (typeof promise === 'undefined') {
        promise = handlers[seq[i]](0);
      } else {
        promise = promise.then(handlers[seq[i]]);
      }
    }

    promise.then(bubbleHandler)["catch"](errorHandler);
  }

  function init(e, auto) {
    if (!auto)
      marks = {};

    // remove sum
    total.innerHTML = '';
    seqtext.innerHTML = '';
    msgtext.innerHTML = '';
    util.removeClass(msgtext, 'failed');

    // remove handler
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');

    // attach handlers
    for (var i = 0; i < numButtons; ++i) {
      // remove number
      var random = buttons[i].getElementsByClassName('random')[0];
      if (util.hasClass(random, 'show'))
        util.removeClass(random, 'show');

      if (!auto) {
        util.addEvent(buttons[i], 'click', handleButton);
        marks[buttons[i].id] = null;
      } else {
        util.removeEvent(buttons[i], 'click', handleButton);
      }

      util.removeClass(buttons[i], 'disabled');
    }
  }

  util.addEvent(window, 'load', function() {
    util.addEvent(atplus, 'mouseenter', init);
    util.addEvent(apb, 'click', autoload);
  });

}(document));
