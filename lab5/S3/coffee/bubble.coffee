((d) ->
  'use strict'
  atplus = d.getElementById('at-plus-container')
  apb = d.getElementsByClassName('apb')[0]
  buttons = atplus.getElementsByClassName('button')
  info = d.getElementById('info-bar')
  total = d.getElementById('total')
  marks = {}
  numButtons = buttons.length
  AUTO = true

  sum = (obj) ->
    ret = 0
    for i of obj
      ret += parseInt obj[i]
    ret

  startPending = (button, auto) ->
    # show ... in button
    random = button.getElementsByClassName('random')[0]
    random.innerHTML = '...'
    util.addClass random, 'show'

    if auto
      return

    # disable other buttons
    for i in [0..numButtons - 1]
      util.removeEvent buttons[i], 'click', handleButton
      if buttons[i] != button
        util.addClass buttons[i], 'disabled'
    return

  stopPending = (button, number, auto) ->
    # show the number
    random = button.getElementsByClassName('random')[0]
    random.innerHTML = number

    # disable this button
    util.addClass button, 'disabled'

    if auto
      return

    # enable other buttons
    for i in [0..numButtons - 1]
      rand = buttons[i].getElementsByClassName('random')[0]
      if buttons[i] != button and !util.hasClass rand, 'show'
        util.addEvent buttons[i], 'click', handleButton
        util.removeClass buttons[i], 'disabled'
    return

  checkInfo = ->
    # check the marks, see if there is anyone null
    for i of marks
      if marks[i] == null
        return
    # attach event hanlder
    util.addEvent info, 'click', calculate
    util.removeClass info, 'disabled'
    return

  calculate = ->
    total.innerHTML = sum marks
    util.removeEvent info, 'click', calculate
    util.addClass info, 'disabled'
    return

  handleButton = (e) ->
    button = e.currentTarget
    promise = new Promise((resolve, reject) ->
      startPending button
      util.ajax.get('/').then (number) ->
        resolve number
        return
      util.addEvent atplus, 'mouseleave', (e) ->
        reject 'abort promise due to mouseleave'
        return
      return
    ).then((number) ->
      stopPending button, number
      util.removeEvent button, handleButton
      marks[button.id] = number
      checkInfo()
      return
    )
    return

  clickButton = (i) ->
    button = buttons[i]
    new Promise((resolve, reject) ->
      startPending button, AUTO
      util.ajax.get('/').then (number) ->
        resolve number
        return
      util.addEvent atplus, 'mouseleave', (e) ->
        reject 'abort promise due to mouseleave'
        return
      return
    ).then (number) ->
      stopPending button, number, AUTO
      util.removeEvent button, handleButton
      marks[button.id] = number
      i++

  autoload = (e) ->
    init e, AUTO
    # stop racing
    util.removeEvent apb, 'click', autoload
    util.addClass apb, 'disabled'

    promises = (clickButton(i) for i in [0..numButtons - 1])

    Promise.all(promises).then(calculate).then ->
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return
    , ->
      console.log 'Promise aborted due to mouseleave'
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return
    return

  init = (e, auto) ->
    marks = {}
    # remove sum
    total.innerHTML = ''

    # remove handler
    util.removeEvent info, 'click', calculate
    util.addClass info, 'disabled'

    # attach handlers
    for i in [0..numButtons - 1]
      # remove number
      random = buttons[i].getElementsByClassName('random')[0]
      util.removeClass random, 'show'

      if !auto
        util.addEvent buttons[i], 'click', handleButton
      else
        util.removeEvent buttons[i], 'click', handleButton
      
      util.removeClass buttons[i], 'disabled'
      marks[buttons[i].id] = null
    return

  util.addEvent window, 'load', ->
    util.addEvent atplus, 'mouseenter', init
    util.addEvent apb, 'click', autoload
    return

)(document)