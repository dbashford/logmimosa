color = require('ansi-color').set
growl = require 'growl'
require 'date-utils'

isDebug = false
isStartup = true
config = null

_log = (logLevel, messages, color, growlTitle = null) ->
  if growlTitle?
    imageUrl = switch logLevel
      when 'success' then "#{__dirname}/assets/success.png"
      when 'error' then "#{__dirname}/assets/failed.png"
      when 'fatal' then "#{__dirname}/assets/failed.png"
      else ''

    growlMessage = messages.join(",").replace /\n/g, ''
    growl growlMessage, {title: growlTitle, image: imageUrl}

  messages = _wrap(messages, color)

  if logLevel is 'error' or logLevel is 'warn' or logLevel is 'fatal'
    console.error messages...
  else
    console.log messages...

_wrap = (messages, textColor) ->
  messages[0] = "#{new Date().toFormat('HH24:MI:SS')} - " + messages[0]
  messages.map (message) -> color message, textColor

setDebug = (isDebug = true) ->

setConfig = (conf) ->
  config = conf

buildDone = (isStartup = false) ->

blue =  (parms...) ->
  parms = parms.map (parm) -> color(parm, "blue+bold")
  console.log parms...

green = (parms...) ->
  parms = parms.map (parm) -> color(parm, "green+bold")
  console.log parms...

red =   (parms...) ->
  parms = parms.map (parm) -> color(parm, "red+bold")
  console.log parms...

error = (parms...) ->
  if parms.length > 0
    lastField = parms[parms.length-1]
    if typeof lastField is "object" and lastField.exitIfBuild?
      exitIfBuild = lastField.exitIfBuild
      parms.pop()

    _log 'error', parms, 'red+bold', 'Error'
    if config and config.exitOnError and exitIfBuild
      console.error("Build is exiting...")
      process.exit(1)

warn =  (parms...) ->
  _log 'warn',  parms, 'yellow'

info =  (parms...) ->
  parms[0] = "#{new Date().toFormat('HH24:MI:SS')} - " + parms[0]
  console.log parms...

fatal = (parms...) ->
  parms[0] = "FATAL: " + parms[0]
  _log 'fatal', parms, 'red+bold+underline', "Fatal Error"

debug = (parms...) ->
  _log 'debug', parms, 'blue' if isDebug or process.env.DEBUG

success = (parms..., options) ->
  if parms.length is 0
    parms = [options]

  title = if options is true
    "Success"
  else if config?.growl?
    s = config.growl.onSuccess
    if isStartup and not config.growl.onStartup
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

  _log 'success', parms, 'green+bold', title

module.exports = {
  success: success
  debug: debug
  fatal: fatal
  info: info
  warn: warn
  error: error
  blue: blue
  red: red
  green: green
  setDebug: setDebug
  setConfig: setConfig
  buildDone: buildDone
}