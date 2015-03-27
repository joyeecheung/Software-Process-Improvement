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
  var marks = {};
  var numButtons = buttons.length;
  var AUTO = true;

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
      if (buttons[i] !== button) {
        if (!auto)
          util.removeEvent(buttons[i], 'click', handleButton);
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
    // check the marks, see if there is anyone null
    for (var i in marks) {
      if (marks[i] === null) return;
    }
    // attach event hanlder
    util.addEvent(info, 'click', calculate);
    util.removeClass(info, 'disabled');
  }

  function sum(obj) {
    var ret = 0;
    for (var i in obj) {
      ret += parseInt(obj[i]);
    }
    return ret;
  }

  function calculate(currentSum) {
    total.innerHTML = currentSum;
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');
  }

  function handleButton(e) {
    var button = e.currentTarget;

    startPending(button);
    var promise = util.ajax.get('/').then(function(number) {
      stopPending(button, number);
      util.removeEvent(button, handleButton);
      marks[button.id] = number;
      checkInfo();
    });
  }

  function clickButton(i, currentSum) {
    var button = buttons[i];

    startPending(button, AUTO);
    return util.ajax.get('/').then(function(number) {
      stopPending(button, number);
      marks[button.id] = number;
      return currentSum + parseInt(number);
    });
  }

  function randomBreak(i, message, currentSum) {
    if (Math.random() > 0.99) {
      return Promise.reject({message: message, currentSum: currentSum});
    } else {
      msgtext.innerHTML = message;
      if (i < 5)
        return clickButton(i, currentSum);
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
           .then(calculate)
           .then(function() {
              util.addEvent(apb, 'click', autoload);
              util.removeClass(apb, 'disabled');
            });
  }

  function autoload(e) {
    init(e, AUTO);
    util.removeEvent(apb, 'click', autoload);  // stop racing
    util.addClass(apb, 'disabled');

    var sequence = [];
    for (i = 0; i < numButtons; ++i) {
      sequence.push(i);
    }
    
    var dict = ['A', 'B', 'C', 'D', 'E'];
    sequence = util.shuffle(sequence);

    var text = sequence.map(function(i){ return dict[i]; }).join(', ');
    seqtext.innerHTML = text;

    var handlers = [aHandler, bHandler, cHandler, dHandler, eHandler];

    var promise;
    for (var i = 0; i < numButtons; ++i) {
      promise = (typeof promise === 'undefined') ?  handlers[sequence[i]](0) :
        promise.then(
          (function(idx) {
            return function(currentSum) {
              return handlers[sequence[idx]](currentSum);
            }
          })(i)
        );
    }

    promise.then(bubbleHandler)["catch"](function(reason) {
      console.log(reason.message);
    })
  }


  function init(e, auto) {
    marks = {};
    // remove sum
    total.innerHTML = '';
    seqtext.innerHTML = '';
    msgtext.innerHTML = '';

    // remove handler
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');

    // attach handlers
    for (var i = 0; i < numButtons; ++i) {
      // remove number
      var random = buttons[i].getElementsByClassName('random')[0];
      if (util.hasClass(random, 'show'))
        util.removeClass(random, 'show');

      if (!auto)
        util.addEvent(buttons[i], 'click', handleButton);

      util.removeClass(buttons[i], 'disabled');
      marks[buttons[i].id] = null;
    }
  }

  util.addEvent(window, 'load', function() {
    util.addEvent(atplus, 'mouseenter', init);
    util.addEvent(apb, 'click', autoload);
  });

}(document));
