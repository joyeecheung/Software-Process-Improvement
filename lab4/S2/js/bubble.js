;
(function(d) {
  'use strict';
  var atplus = d.getElementById('at-plus-container');
  var apb = d.getElementsByClassName('apb')[0];
  var buttons = atplus.getElementsByClassName('button');
  var info = d.getElementById('info-bar');
  var total = d.getElementById('total');
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

  function calculate() {
    for (var i in marks) {
      if (marks[i] === null) return;
    }

    total.innerHTML = sum(marks);
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

  function clickButton(i) {
    var button = buttons[i];

    startPending(button, AUTO);
    return util.ajax.get('/').then(function(number) {
      stopPending(button, number, AUTO);
      marks[button.id] = number;
      return i++;
    });
  }

  function autoload(e) {
    init(e, AUTO);
    util.removeEvent(apb, 'click', autoload);  // stop racing
    util.addClass(apb, 'disabled');

    // chains promise sequentially
    var promise;
    for (var i = 0; i < numButtons; ++i) {
      promise = (typeof promise === 'undefined') ? clickButton(0) :
        promise.then(
          (function(idx) {
            return function() {
              return clickButton(idx);
            }
          })(i)
        )
    }

    // finish up
    promise.then(calculate).then(function() {
      util.addEvent(apb, 'click', autoload);
      util.removeClass(apb, 'disabled');
    });
  }

  function init(e, auto) {
    marks = {};
    // remove sum
    total.innerHTML = '';

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
      } else {
        util.removeEvent(buttons[i], 'click', handleButton);
      }

      util.removeClass(buttons[i], 'disabled');
      marks[buttons[i].id] = null;
    }
  }

  util.addEvent(window, 'load', function() {
    util.addEvent(atplus, 'mouseenter', init);
    util.addEvent(apb, 'click', autoload);
  });

}(document));
