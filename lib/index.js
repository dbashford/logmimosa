var blue, buildDone, color, config, debug, error, fatal, green, growl, info, isDebug, isStartup, red, setConfig, setDebug, success, warn, _log, _wrap,
  __slice = [].slice;

color = require('ansi-color').set;

growl = require('growl');

require('date-utils');

isDebug = false;

isStartup = true;

config = null;

_log = function(logLevel, messages, color, growlTitle) {
  var growlMessage, imageUrl;
  if (growlTitle == null) {
    growlTitle = null;
  }
  if (growlTitle != null) {
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
  messages = _wrap(messages, color);
  if (logLevel === 'error' || logLevel === 'warn' || logLevel === 'fatal') {
    return console.error.apply(console, messages);
  } else {
    return console.log.apply(console, messages);
  }
};

_wrap = function(messages, textColor) {
  messages[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + messages[0];
  return messages.map(function(message) {
    return color(message, textColor);
  });
};

setDebug = function(isDebug) {
  if (isDebug == null) {
    isDebug = true;
  }
};

setConfig = function(conf) {
  return config = conf;
};

buildDone = function(isStartup) {
  if (isStartup == null) {
    isStartup = false;
  }
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

error = function() {
  var exitIfBuild, lastField, parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (parms.length > 0) {
    lastField = parms[parms.length - 1];
    if (typeof lastField === "object" && (lastField.exitIfBuild != null)) {
      exitIfBuild = lastField.exitIfBuild;
      parms.pop();
    }
    _log('error', parms, 'red+bold', 'Error');
    if (config && config.exitOnError && exitIfBuild) {
      console.error("Build is exiting...");
      return process.exit(1);
    }
  }
};

warn = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return _log('warn', parms, 'yellow');
};

info = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + parms[0];
  return console.log.apply(console, parms);
};

fatal = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  parms[0] = "FATAL: " + parms[0];
  return _log('fatal', parms, 'red+bold+underline', "Fatal Error");
};

debug = function() {
  var parms;
  parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (isDebug || process.env.DEBUG) {
    return _log('debug', parms, 'blue');
  }
};

success = function() {
  var options, parms, s, title, _i;
  parms = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
  if (parms.length === 0) {
    parms = [options];
  }
  title = options === true ? "Success" : (config != null ? config.growl : void 0) != null ? (s = config.growl.onSuccess, isStartup && !config.growl.onStartup ? null : !options || (options.isJavascript && s.javascript) || (options.isCSS && s.css) || (options.isTemplate && s.template) || (options.isCopy && s.copy) ? "Success" : null) : "Success";
  return _log('success', parms, 'green+bold', title);
};

module.exports = {
  success: success,
  debug: debug,
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
