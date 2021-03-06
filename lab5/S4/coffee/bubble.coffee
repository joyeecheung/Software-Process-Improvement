((d) ->
  'use strict'
  atplus = d.getElementById('at-plus-container')
  apb = d.getElementsByClassName('apb')[0]
  buttons = atplus.getElementsByClassName('button')
  info = d.getElementById('info-bar')
  total = d.getElementById('total')
  seqtext = d.getElementById('sequence')
  marks = {}
  numButtons = buttons.length
  AUTO = true

  sum = (obj) ->
    ret = 0
    for i of obj
      ret += parseInt obj[i]
    ret

  startPending = (button, auto) ->
    # check if it is disabled
    if util.hasClass button, 'disabled'
      return

    # show ... in button
    random = button.getElementsByClassName('random')[0]
    random.innerHTML = '...'
    util.addClass random, 'show'

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

    # enable other buttons
    for i in [0..numButtons - 1]
      rand = buttons[i].getElementsByClassName('random')[0]
      if buttons[i] != button and !util.hasClass rand, 'show'
        if !auto
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

    seq = util.shuffle(i for i in [0..numButtons - 1])
    dict = ['A', 'B', 'C', 'D', 'E']
    text = (dict[i] for i in seq).join(', ')
    seqtext.innerHTML = text

    promise = undefined
    for i in [0..numButtons - 1]
      if typeof promise == 'undefined'
        promise = clickButton(seq[i])
      else
        promise = promise.then(clickButton.bind(this, seq[i]))

    # finish up
    promise.then(calculate).then ->
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return
    , (reason) ->
      console.log if reason.message then reason.message else reason
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return
    return

  init = (e, auto) ->
    marks = {}
    # remove sum
    total.innerHTML = ''
    seqtext.innerHTML = ''

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