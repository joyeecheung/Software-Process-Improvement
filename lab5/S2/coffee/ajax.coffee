this.util.ajax = do ->
  'use strict'
  DONE = 4
  OK = 200

  core = (method, url, args) ->
    url = url + '?ts=' + Date.now()
    # add time stamp to avoid cache
    # Establishing a promise in return
    new Promise((resolve, reject) ->
      # Instantiates the XMLHttpRequest
      client = new XMLHttpRequest
      client.open method, url, true
      client.setRequestHeader 'Cache-Control', 'no-cache, no-store'
      util.addEvent client, 'readystatechange', (e) ->
        me = e.target
        if me.readyState == DONE
          if me.status == OK
            resolve me.responseText
          else
            reject 'error': me.statusText
        return
      client.send url
      return
)

  {
    'get': (url, args) ->
      core 'GET', url, args
    'post': (url, args) ->
      core 'POST', url, args
    'put': (url, args) ->
      core 'PUT', url, args
    'delete': (url, args) ->
      core 'DELETE', url, args

  }