(function() {
  (function(d) {
    'use strict';
    var atplus, buttons, calculate, checkInfo, handleButton, info, init, marks, numButtons, startPending, stopPending, sum, total;
    atplus = d.getElementById('at-plus-container');
    buttons = atplus.getElementsByClassName('button');
    info = d.getElementById('info-bar');
    total = d.getElementById('total');
    marks = {};
    numButtons = buttons.length;
    sum = function(obj) {
      var i, ret;
      ret = 0;
      for (i in obj) {
        ret += parseInt(obj[i]);
      }
      return ret;
    };
    startPending = function(button) {
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
    stopPending = function(button, number) {
      var i, j, rand, random, ref;
      random = button.getElementsByClassName('random')[0];
      random.innerHTML = number;
      util.addClass(button, 'disabled');
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        rand = buttons[i].getElementsByClassName('random')[0];
        if (buttons[i] !== button && !util.hasClass(rand, 'show')) {
          util.addEvent(buttons[i], 'click', handleButton);
          util.removeClass(buttons[i], 'disabled');
        }
      }
    };
    checkInfo = function() {
      var i;
      for (i in marks) {
        if (marks[i] === null) {
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
    init = function() {
      var i, j, random, ref;
      marks = {};
      total.innerHTML = '';
      util.removeEvent(info, 'click', calculate);
      util.addClass(info, 'disabled');
      for (i = j = 0, ref = numButtons - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        random = buttons[i].getElementsByClassName('random')[0];
        util.removeClass(random, 'show');
        util.addEvent(buttons[i], 'click', handleButton);
        util.removeClass(buttons[i], 'disabled');
        marks[buttons[i].id] = null;
      }
    };
    return util.addEvent(window, 'load', function() {
      util.addEvent(atplus, 'mouseenter', init);
    });
  })(document);

}).call(this);
