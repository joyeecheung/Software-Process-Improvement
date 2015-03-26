;
(function(d) {
  'use strict';
  var atplus = d.getElementById('at-plus-container');
  var buttons = atplus.getElementsByClassName('button');
  var info = d.getElementById('info-bar');
  var total = d.getElementById('total');
  var marks = {};
  var numButtons = buttons.length;

  function startPending(button) {
    // check if it is disabled
    if (!util.hasClass(button, 'disabled')) {
      // show ... in button
      var random = button.getElementsByClassName('random')[0];
      if (random)
        random.innerHTML = '...'
      else {
        random = util.createElement('span', '...', 'random');
        button.appendChild(random);
      }

      // disable other buttons
      for (var i = 0, len = buttons.length; i < len; ++i) {
        if (buttons[i] !== button) {
          util.addClass(buttons[i], 'disabled');
        }
      }
    }
  }

  function stopPending(button, number) {
    // show the number
    var random = button.getElementsByClassName('random')[0];
    random.innerHTML = number;

    // disable this button
    util.addClass(button, 'disabled');

    // enable other buttons
    for (var i = 0, len = buttons.length; i < len; ++i) {
      if (buttons[i] !== button && !buttons[i].getElementsByClassName('random')[0]) {
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
    total.innerHTML = sum(marks);
  }

  function clickButton(i) {
    var button = buttons[i];
    console.log(button);
    startPending(button);
    return util.ajax.get('/').then(function(number) {
      stopPending(button, number);
      marks[button.id] = number;
      checkInfo();
      return i++;
    });
  }

  function init() {
    marks = {};
    // remove sum
    total.innerHTML = '';

    // remove handler
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');

    var promise;
    // attach handlers
    for (var i = 0, len = buttons.length; i < len; ++i) {
      // remove number
      var random = buttons[i].getElementsByClassName('random')[0];
      if (random)
        util.removeElement(random);
      util.removeClass(buttons[i], 'disabled');
      marks[buttons[i].id] = null;
    }

    var sequence = [];
    for (i = 0; i < numButtons; ++i) {
      sequence.push(i);
    }
    
    sequence = util.shuffle(sequence);

    var text = 'Sequence: ' + sequence.join(', ');
    document.body.appendChild(util.createElement('p', text));

    for (i = 0; i < numButtons; ++i) {
      promise = (typeof promise === 'undefined') ? clickButton(sequence[i]) :
        promise.then(
          (function(idx) {
            return function() {
              console.log(arguments); return clickButton(sequence[idx]);
            }
          })(i)
        )
    }
    promise.then(calculate);
  }

  util.addEvent(window, 'load', function() {
    util.addEvent(atplus, 'mouseenter', init);
  });

}(document));
