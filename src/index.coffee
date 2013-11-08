color = require('ansi-color').set
growl = require 'growl'
require 'date-utils'

class Logger

  isDebug: false
  isStartup: true

  setDebug: (@isDebug = true) ->
  setConfig: (@config) ->
  buildDone: (@isStartup = false) =>

  _log: (logLevel, messages, color, growlTitle = null) ->
    if growlTitle?
      imageUrl = switch logLevel
        when 'success' then "#{__dirname}/assets/success.png"
        when 'error' then "#{__dirname}/assets/failed.png"
        when 'fatal' then "#{__dirname}/assets/failed.png"
        else ''

      growlMessage = messages.join(",").replace /\n/g, ''
      growl growlMessage, {title: growlTitle, image: imageUrl}

    messages = @_wrap(messages, color)

    if logLevel is 'error' or logLevel is 'warn' or logLevel is 'fatal'
      console.error messages...
    else
      console.log messages...

  _wrap: (messages, textColor) ->
    messages[0] = "#{new Date().toFormat('HH24:MI:SS')} - " + messages[0]
    messages.map (message) -> color message, textColor

  blue:  (parms...) =>
    parms = parms.map (parm) -> color(parm, "blue+bold")
    console.log parms...

  green: (parms...) =>
    parms = parms.map (parm) -> color(parm, "green+bold")
    console.log parms...

  red:   (parms...) =>
    parms = parms.map (parm) -> color(parm, "red+bold")
    console.log parms...

  error: (parms...) =>
    if parms.length > 0
      lastField = parms[parms.length-1]
      if typeof lastField is "object" and lastField.exitIfBuild?
        exitIfBuild = lastField.exitIfBuild
        parms.pop()

      @_log 'error', parms, 'red+bold', 'Error'
      if @config and @config.isBuild and @config.exitOnError and exitIfBuild
        console.error("Build is exiting...")
        process.exit(1)

  warn:  (parms...) =>
    @_log 'warn',  parms, 'yellow'

  info:  (parms...) =>
    parms[0] = "#{new Date().toFormat('HH24:MI:SS')} - " + parms[0]
    console.log parms...

  fatal: (parms...) =>
    parms[0] = "FATAL: " + parms[0]
    @_log 'fatal', parms, 'red+bold+underline', "Fatal Error"

  debug: (parms...) =>
    @_log 'debug', parms, 'blue' if @isDebug or process.env.DEBUG

  success: (parms..., options) =>
    if parms.length is 0
      parms = [options]

    title = if options is true
      "Success"
    else if @config?.growl?
      s = @config.growl.onSuccess
      if @isStartup and not @config.growl.onStartup
        null
      else if not options or
        (options.isJavascript and s.javascript) or
        (options.isCSS and s.css) or
        (options.isTemplate and s.template) or
        (options.isCopy and s.copy)
          "Success"
      else
        null
    else
      "Success"

    @_log 'success', parms, 'green+bold', title

  defaults: ->
    growl:
      onStartup: false
      onSuccess:
        javascript: true
        css: true
        template: true
        copy: true

  placeholder: ->
    """
    \t

      # growl:
        # onStartup: false       # Controls whether or not to Growl when assets successfully
                                 # compile/copy on startup, If you've got 100 CoffeeScript files,
                                 # and you do a clean and then start watching, you'll get 100 Growl
                                 # notifications.  This is set to false by default to prevent that.
                                 # Growling for every successful file on startup can also cause
                                 # EMFILE issues. See watch.throttle
        # onSuccess:             # Controls whether to Growl when assets successfully compile/copy
          # javascript: true     # growl on successful compilation? will always send on failure
          # css: true            # growl on successful compilation? will always send on failure
          # template: true       # growl on successful compilation? will always send on failure
          # copy: true           # growl on successful copy?
    """

  validate: (config) ->
    errors = []
    if config.growl?
      if typeof config.growl is "object" and not Array.isArray(config.growl)
        if config.growl.onStartup?
          unless typeof config.growl.onStartup is "boolean"
            errors.push "growl.onStartup must be boolean"
        if config.growl.onSuccess?
          succ = config.growl.onSuccess
          if typeof succ is "object" and not Array.isArray(succ)
            for type in ["javascript", "css", "template", "copy"]
              if succ[type]?
                unless typeof succ[type] is "boolean"
                  errors.push "growl.onSuccess.#{type} must be boolean."
          else
            errors.push "growl.onSuccess must be an object."
      else
        errors.push "lint configuration must be an object."
    errors

module.exports = new Logger()
