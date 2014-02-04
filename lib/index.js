var blue, buildDone, color, config, debug, doDebug, error, fatal, green, growl, info, isDebug, isStartup, mimosaConfig, pathh, red, setConfig, setDebug, success, warn, _colorize, _log, _wrap,
  __slice = [].slice;

pathh = require('path');

color = require('ansi-color').set;

growl = require('growl');

require('date-utils');

config = require('./config');

doDebug = false;

isStartup = true;

mimosaConfig = null;

setDebug = function(isD) {
  if (isD == null) {
    isD = true;
  }
  return doDebug = isD;
};

isDebug = function() {
  return doDebug;
};

setConfig = function(conf) {
  return mimosaConfig = conf;
};

buildDone = function(startup) {
  if (startup == null) {
    startup = false;
  }
  return isStartup = startup;
};

_log = function(logLevel, messages, colorText, growlTitle) {
  var growlMessage, imageUrl;
  if ((growlTitle != null) && (!mimosaConfig || mimosaConfig.logger.growl.enabled)) {
    imageUrl = (function() {
      switch (logLevel) {
        case 'success':
          return "" + __dirname + "/assets/success.png";
        case 'error':
          return "" + __dirname + "/assets/failed.png";
        case 'fatal':
          return "" + __dirname + "/assets/failed.png";
        default:
          return '';
      }
    })();
    growlMessage = messages.join(",").replace(/\n/g, '');
    growl(growlMessage, {
      title: growlTitle,
      image: imageUrl
    });
  }
  _wrap(messages, logLevel, colorText);
  messages = _colorize(messages);
  if (logLevel === 'error' || logLevel === 'warn' || logLevel === 'fatal') {
    return console.error.apply(console, messages);
  } else {
    return console.log.apply(console, messages);
  }
};

_colorize = function(messages) {
  return messages.map(function(message) {
    return message.replace(/\[\[ (.+?) ]]/g, function(match, path) {
      if (mimosaConfig.logger.embeddedText.enabled) {
        path = path.replace(mimosaConfig.root + pathh.sep, '');
        return color(path, mimosaConfig.logger.embeddedText.color);
      } else {
        return match.replace(mimosaConfig.root + pathh.sep, '');
      }
    });
  });
};

_wrap = function(messages, logLevel, textColor) {
  var levelUpper;
  levelUpper = logLevel === "error" || logLevel === "warn" || logLevel === 'fatal' ? logLevel.toUpperCase() : logLevel.charAt(0).toUpperCase() + logLevel.slice(1);
  if (textColor) {
    levelUpper = color(levelUpper, textColor);
  }
  return messages[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + levelUpper + " - " + messages[0];
};

error = function() {
  var colorText, exitIfBuild, lastField, parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (parms.length > 0) {
    lastField = parms[parms.length - 1];
    if (typeof lastField === "object" && (lastField.exitIfBuild != null)) {
      exitIfBuild = lastField.exitIfBuild;
      parms.pop();
    }
    if (!mimosaConfig || mimosaConfig.logger.error.enabled) {
      colorText = mimosaConfig ? mimosaConfig.logger.error.color : "red+bold";
      _log('error', parms, colorText, 'Error');
    }
    if (mimosaConfig && mimosaConfig.exitOnError && exitIfBuild) {
      console.error("Error occurred, exitOnError flag used, build is exiting...");
      return process.exit(1);
    }
  }
};

warn = function() {
  var colorText, parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (!mimosaConfig || mimosaConfig.logger.warn.enabled) {
    colorText = mimosaConfig ? mimosaConfig.logger.warn.color : "yellow";
    return _log('warn', parms, colorText);
  }
};

info = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (!mimosaConfig || mimosaConfig.logger.info.enabled) {
    if (mimosaConfig) {
      return _log('info', parms, mimosaConfig.logger.info.color || '');
    } else {
      parms[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + parms[0];
      return console.log.apply(console, parms);
    }
  }
};

debug = function() {
  var colorText, parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (doDebug || process.env.DEBUG) {
    colorText = mimosaConfig ? mimosaConfig.logger.debug.color : "blue";
    return _log('debug', parms, colorText);
  }
};

success = function() {
  var colorText, options, parms, s, title, _i, _ref;
  parms = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
  if (!mimosaConfig || mimosaConfig.logger.success.enabled) {
    if (parms.length === 0) {
      parms = [options];
    }
    title = options === true ? "Success" : (mimosaConfig != null ? (_ref = mimosaConfig.logger) != null ? _ref.growl : void 0 : void 0) != null ? (s = mimosaConfig.logger.growl.onSuccess, isStartup && !mimosaConfig.logger.growl.onStartup ? null : mimosaConfig.logger.growl.onSuccess ? "Success" : null) : "Success";
    colorText = mimosaConfig ? mimosaConfig.logger.success.color : "green+bold";
    return _log('success', parms, colorText, title);
  }
};

fatal = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms[0] = "FATAL: " + parms[0];
  return _log('fatal', parms, 'red+bold+underline', "Fatal Error");
};

blue = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms = parms.map(function(parm) {
    return color(parm, "blue+bold");
  });
  return console.log.apply(console, parms);
};

green = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms = parms.map(function(parm) {
    return color(parm, "green+bold");
  });
  return console.log.apply(console, parms);
};

red = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms = parms.map(function(parm) {
    return color(parm, "red+bold");
  });
  return console.log.apply(console, parms);
};

module.exports = {
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate,
  success: success,
  debug: debug,
  isDebug: isDebug,
  fatal: fatal,
  info: info,
  warn: warn,
  error: error,
  blue: blue,
  red: red,
  green: green,
  setDebug: setDebug,
  setConfig: setConfig,
  buildDone: buildDone
};
