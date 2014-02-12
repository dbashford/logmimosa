pathh = require 'path'

color = require('ansi-color').set
growl = require 'growl'
require 'date-utils'

config = require './config'

doDebug = false
isStartup = true
mimosaConfig = config.defaults()
mimosaConfig.root = process.cwd()

setDebug = (isD = true) ->
  doDebug = isD

isDebug = ->
  doDebug

setConfig = (conf) ->
  mimosaConfig = conf

buildDone = (startup = false) ->
  isStartup = startup

_log = (logLevel, messages, colorText, growlTitle) ->
  if growlTitle? and  mimosaConfig.logger.growl.enabled
    imageUrl = switch logLevel
      when 'success' then "#{__dirname}/assets/success.png"
      when 'error' then "#{__dirname}/assets/failed.png"
      when 'fatal' then "#{__dirname}/assets/failed.png"
      else ''

    growlMessage = messages.join(",").replace /\n/g, ''
    growl growlMessage, {title: growlTitle, image: imageUrl}

  _wrap(messages, logLevel, colorText)
  messages = _colorize(messages)

  if logLevel is 'error' or logLevel is 'warn' or logLevel is 'fatal'
    console.error messages...
  else
    console.log messages...

_colorize = (messages) ->
  messages.map (message) ->
    if typeof message is "string"
      message.replace /\[\[ (.+?) ]]/g,  (match, path) ->
        if mimosaConfig.logger.embeddedText.enabled
          path = path.replace(mimosaConfig.root + pathh.sep, '')
          color(path, mimosaConfig.logger.embeddedText.color)
        else
          match.replace(mimosaConfig.root + pathh.sep, '')
    else
      message

_wrap = (messages, logLevel, textColor) ->
  levelUpper = if logLevel is "error" or logLevel is "warn" or logLevel is 'fatal'
    logLevel.toUpperCase()
  else
    logLevel.charAt(0).toUpperCase() + logLevel.slice(1)
  if textColor
    levelUpper = color(levelUpper, textColor)
  messages[0] = "#{new Date().toFormat('HH24:MI:SS')} - " +  levelUpper + " - " + messages[0]

error = (parms...) ->
  if parms.length > 0
    lastField = parms[parms.length-1]
    if typeof lastField is "object" and lastField.exitIfBuild?
      exitIfBuild = lastField.exitIfBuild
      parms.pop()

    if mimosaConfig.logger.error.enabled
      _log 'error', parms, mimosaConfig.logger.error.color, 'Error'

    if mimosaConfig.exitOnError and exitIfBuild
      console.error("Error occurred, exitOnError flag used, build is exiting...")
      process.exit(1)

warn = (parms...) ->
  if mimosaConfig.logger.warn.enabled
    _log 'warn',  parms, mimosaConfig.logger.warn.color

info = (parms...) ->
  if mimosaConfig.logger.info.enabled
    _log 'info', parms, mimosaConfig.logger.info.color || ''

debug = (parms...) ->
  if doDebug or process.env.DEBUG
    _log 'debug', parms, mimosaConfig.logger.debug.color

success = (parms..., options) ->
  if mimosaConfig.logger.success.enabled
    if parms.length is 0
      parms = [options]

    title = if options is true
      "Success"
    else
      if isStartup and not mimosaConfig.logger.growl.onStartup
        null
      else if mimosaConfig.logger.growl.onSuccess
        "Success"
      else
        null

    _log 'success', parms, mimosaConfig.logger.success.color, title

fatal = (parms...) ->
  parms[0] = "FATAL: " + parms[0]
  _log 'fatal', parms, 'red+bold+underline', "Fatal Error"

blue =  (parms...) ->
  parms = parms.map (parm) -> color(parm, "blue+bold")
  console.log parms...

green = (parms...) ->
  parms = parms.map (parm) -> color(parm, "green+bold")
  console.log parms...

red =   (parms...) ->
  parms = parms.map (parm) -> color(parm, "red+bold")
  console.log parms...

module.exports = {
  defaults: config.defaults
  placeholder: config.placeholder
  validate: config.validate
  success: success
  debug: debug
  isDebug: isDebug
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