(function() {
  this.util = (function(d) {
    'use strict';
    var addClass, addEvent, createElement, getTarget, getText, hasClass, removeClass, removeElement, removeEvent, shuffle, toArray;
    addEvent = function(element, event, handler) {
      if (element.addEventListener) {
        element.addEventListener(event, handler, false);
      } else {
        element['e' + event + handler] = handler;
        element[event + handler] = function(e) {
          e.currentTarget = element;
          element['e' + event + handler](e || window.event);
        };
        element.attachEvent('on' + event, element[event + handler]);
      }
    };
    removeEvent = function(element, event, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(event, handler);
      } else {
        element.detachEvent('on' + event, element[event + handler]);
        element[event + handler] = null;
      }
    };
    getTarget = function(event) {
      return event.target || event.srcElement;
    };
    hasClass = function(element, className) {
      var reg;
      if (element.classList) {
        return element.classList.contains(className);
      } else {
        reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        return !!element.className.match(reg);
      }
    };
    addClass = function(element, className) {
      if (element.classList) {
        element.classList.add(className);
      } else if (!hasClass(element, className)) {
        element.className += ' ' + className;
      }
    };
    removeClass = function(element, className) {
      var reg;
      if (element.classList) {
        element.classList.remove(className);
      } else if (hasClass(element, className)) {
        reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        element.className = element.className.replace(reg, ' ');
      }
    };
    getText = function(node) {
      return node.textContent || node.innerText;
    };
    createElement = function(tag, text, className) {
      var element, textNode;
      element = d.createElement(tag);
      if (text) {
        textNode = d.createTextNode(text);
        element.appendChild(textNode);
      }
      if (className) {
        addClass(element, className);
      }
      return element;
    };
    removeElement = function(element) {
      return element.parentNode.removeChild(element);
    };
    toArray = function(iterable) {
      var arr, i, len;
      arr = [];
      i = 0;
      len = iterable.length;
      while (i < len) {
        arr.push(iterable[i]);
        ++i;
      }
      return arr;
    };
    shuffle = function(arr) {
      return arr.sort(function() {
        return Math.random() - 0.5;
      });
    };
    return {
      addEvent: addEvent,
      removeEvent: removeEvent,
      getTarget: getTarget,
      hasClass: hasClass,
      addClass: addClass,
      removeClass: removeClass,
      getText: getText,
      createElement: createElement,
      removeElement: removeElement,
      toArray: toArray,
      shuffle: shuffle
    };
  })(document);

}).call(this);
