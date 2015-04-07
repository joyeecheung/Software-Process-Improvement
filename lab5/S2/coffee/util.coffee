this.util = ((d) ->
  'use strict'
  addEvent = (element, event, handler) ->
    if element.addEventListener
      element.addEventListener event, handler, false
    else
      element['e' + event + handler] = handler

      element[event + handler] = (e) ->
        e.currentTarget = element
        element['e' + event + handler] e or window.event
        return

      element.attachEvent 'on' + event, element[event + handler]
    return

  removeEvent = (element, event, handler) ->
    if element.removeEventListener
      element.removeEventListener event, handler
    else
      element.detachEvent 'on' + event, element[event + handler]
      element[event + handler] = null
    return

  getTarget = (event) ->
    event.target or event.srcElement

  hasClass = (element, className) ->
    if element.classList
      element.classList.contains className
    else
      reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g')
      ! !element.className.match(reg)

  addClass = (element, className) ->
    if element.classList
      element.classList.add className
    else if !hasClass(element, className)
      element.className += ' ' + className
    return

  removeClass = (element, className) ->
    if element.classList
      element.classList.remove className
    else if hasClass(element, className)
      reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g')
      element.className = element.className.replace(reg, ' ')
    return

  getText = (node) ->
    node.textContent or node.innerText

  createElement = (tag, text, className) ->
    element = d.createElement(tag)
    if text
      textNode = d.createTextNode(text)
      element.appendChild textNode
    if className
      addClass element, className
    element

  removeElement = (element) ->
    element.parentNode.removeChild element

  toArray = (iterable) ->
    arr = []
    i = 0
    len = iterable.length
    while i < len
      arr.push iterable[i]
      ++i
    arr

  shuffle = (arr) ->
    arr.sort ->
      Math.random() - 0.5

  {
    addEvent: addEvent
    removeEvent: removeEvent
    getTarget: getTarget
    hasClass: hasClass
    addClass: addClass
    removeClass: removeClass
    getText: getText
    createElement: createElement
    removeElement: removeElement
    toArray: toArray
    shuffle: shuffle
  }
)(document)