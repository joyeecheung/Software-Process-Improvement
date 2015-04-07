((d) ->
  'use strict'
  atplus = d.getElementById('at-plus-container')
  apb = d.getElementsByClassName('apb')[0]
  buttons = atplus.getElementsByClassName('button')
  msgtext = d.getElementById('message')
  info = d.getElementById('info-bar')
  total = d.getElementById('total')
  seqtext = d.getElementById('sequence')
  marks = {} # for non-auto calls

  numButtons = buttons.length
  AUTO = true
  FAIL_RATE = 0.3
  ABORT = 1
  RANDOM_FAIL = 2

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
    for i in [0..numButtons - 1]
      if !util.hasClass buttons[i], 'disabled'
        return

    # attach event hanlder
    util.addEvent info, 'click', calculate
    util.removeClass info, 'disabled'
    return

  # for manual calls
  calculate = ->
    total.innerHTML = sum marks
    util.removeEvent info, 'click', calculate
    util.addClass info, 'disabled'
    return

  # for manual calls
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

  # for auto calls
  autoCalculate = (currentSum) ->
    total.innerHTML = currentSum
    util.addClass info, 'disabled'
    return

  # for auto calls
  clickButton = (button, currentSum, auto) ->
    new Promise((resolve, reject) ->
      startPending button, auto
      util.ajax.get('/').then (number) ->
        resolve number
        return
      util.addEvent atplus, 'mouseleave', (e) ->
        reject
          message: 'abort promise due to mouseleave'
          error: ABORT
        return
      return
    ).then (number) ->
      stopPending button, number, AUTO
      util.removeEvent button, handleButton
      currentSum + parseInt number

  randomBreak = (i, message, currentSum) ->
    if Math.random() < FAIL_RATE
      Promise.reject
        message: message
        currentSum: currentSum
    else
      msgtext.innerHTML = message
      if i < 5
        clickButton buttons[i], currentSum, AUTO
      else
        Promise.resolve currentSum

  aHandler = (currentSum) ->
    randomBreak 0, '这是个天大的秘密', currentSum

  bHandler = (currentSum) ->
    randomBreak 1, '我不知道', currentSum

  cHandler = (currentSum) ->
    randomBreak 2, '你不知道', currentSum

  dHandler = (currentSum) ->
    randomBreak 3, '他不知道', currentSum

  eHandler = (currentSum) ->
    randomBreak 4, '才怪', currentSum

  bubbleHandler = (currentSum) ->
    randomBreak(5, '楼主异步调用战斗力感人, 目测不超过' + currentSum, currentSum).then(autoCalculate).then ->
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return

  errorHandler = (reason) ->
    if reason.error == ABORT
      console.log reason.message
      util.addEvent apb, 'click', autoload
      util.removeClass apb, 'disabled'
      return
    
    negation = 
      '这是个天大的秘密': '这不是个天大的秘密'
      '我不知道': '我知道'
      '你不知道': '你知道'
      '他不知道': '他知道'
      '才怪': '才不怪'

    if negation[reason.message]
      msgtext.innerHTML = negation[reason.message]
    else
      msgtext.innerHTML = reason.message.replace('目测不超过', '目测超过')
      autoCalculate reason.currentSum
    
    util.addClass msgtext, 'failed'
    util.addEvent apb, 'click', autoload
    util.removeClass apb, 'disabled'
    reason.currentSum

  autoload = (e) ->
    init e, AUTO

    # stop racing
    util.removeEvent apb, 'click', autoload
    util.addClass apb, 'disabled'
    
    seq = util.shuffle(i for i in [0..numButtons - 1])
    dict = ['A', 'B', 'C', 'D', 'E']
    text = (dict[i] for i in seq).join(', ')
    seqtext.innerHTML = text

    handlers = [aHandler, bHandler, cHandler, dHandler, eHandler]
    
    promise = undefined
    for i in [0..numButtons]
      if typeof promise == 'undefined'
        promise = handlers[seq[i]](0)
      else
        promise = promise.then handlers[seq[i]]
    promise.then(bubbleHandler)['catch'] errorHandler
    return


  init = (e, auto) ->
    if !auto
      marks = {}
    # remove sum
    total.innerHTML = ''
    seqtext.innerHTML = ''
    msgtext.innerHTML = ''
    util.removeClass msgtext, 'failed'

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
        marks[buttons[i].id] = null
      else
        util.removeEvent buttons[i], 'click', handleButton
      
      util.removeClass buttons[i], 'disabled'
    return

  util.addEvent window, 'load', ->
    util.addEvent atplus, 'mouseenter', init
    util.addEvent apb, 'click', autoload
    return

)(document)
