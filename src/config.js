"use strict";

var color = require('ansi-color').set;

exports.defaults = function() {
  return {
    logger: {
      info: {
        enabled: true,
        color: null
      },
      warn: {
        enabled: true,
        color: 'yellow+bold'
      },
      success: {
        enabled: true,
        color: 'green'
      },
      error: {
        enabled: true,
        color: 'red+bold'
      },
      debug: {
        color: 'blue'
      },
      embeddedText: {
        enabled: true,
        color: 'cyan'
      },
      growl: {
        enabled: true,
        onStartup: false,
        onSuccess: true
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  logger:                  # logger settings, supported colors:\n" +
         "                           # https://github.com/loopj/commonjs-ansi-color#supported-colorsformats\n" +
         "    info:                  # config for info level logging\n" +
         "      enabled: true        # if info level logging is enabled\n" +
         "      color: null          # color for info level logging, null is default terminal color\n" +
         "    warn:                  # config for warn level logging\n" +
         "      enabled: true        # if warn level logging is enabled\n" +
         "      color: 'yellow'      # color for warn level logging, null is default terminal color\n" +
         "    success:               # config for success level logging\n" +
         "      enabled: true        # if success level logging is enabled\n" +
         "      color: 'green+bold'  # color for success level logging, null is default terminal color\n" +
         "    error:                 # config for error level logging\n" +
         "      enabled: true        # if error level logging is enabled\n" +
         "      color: 'red+bold'    # color for error level logging, null is default terminal color\n" +
         "    debug:                 # config for debug level logging, debug is enabled with mimosa -D flag\n" +
         "      color: 'blue'        # color for debug level logging, null is default terminal color\n" +
         "    embeddedText:          # config for text surrounded in [[ ]] inside log messages\n" +
         "      enabled: true        # transforms [[ ]] and the text inside to just text inside and colorizes\n" +
         "      color: 'cyan'    # color for transformed embedded text\n" +
         "    growl:                 # Settings for growl notifications\n" +
         "      enabled: true        # Whether or not growl notificaations are enabled\n" +
         "      onStartup: false     # Controls whether or not to Growl when assets successfully\n" +
         "                           # compile/copy on startup, If you've got 100 CoffeeScript files,\n" +
         "                           # and you do a clean and then start watching, you'll get 100 Growl\n" +
         "                           # notifications.  This is set to false by default to prevent that.\n" +
         "                           # Growling for every successful file on startup can also cause\n" +
         "                           # EMFILE issues. See watch.throttle\n" +
         "      onSuccess: true      # Controls whether to Growl when assets successfully compile/copy\n";
};

exports.validate = function ( config, validators ) {
  var errors = [];

  if ( config.growl ) {
    var msg = "The 'growl' config has been eliminated with Mimosa 2.1, please use the new 'logger' config.";
    var dep = color( msg, "red+bold" );
    console.log( dep );
  }

  if ( validators.ifExistsIsObject( errors, "logger config", config.logger)  ) {
    if ( validators.ifExistsIsObject( errors, "logger.growl", config.logger.growl)  ) {
      var grwl = config.logger.growl;
      validators.ifExistsIsBoolean( errors, "logger.growl.enabled", grwl.enabled );
      validators.ifExistsIsBoolean( errors, "logger.growl.onStartup", grwl.onStartup );
      validators.ifExistsIsBoolean( errors, "logger.growl.onSuccess", grwl.onSuccess );
    }

    ['info', 'warn', 'success', 'error', 'debug', 'embeddedText'].forEach( function( logLevel ) {
      if ( validators.ifExistsIsObject( errors, "logger." + logLevel, config.logger[logLevel] ) ) {
        validators.ifExistsIsBoolean( errors, "logger." + logLevel + ".enabled", config.logger[logLevel].enabled );
        validators.ifExistsIsString( errors, "logger." + logLevel + ".color", config.logger[logLevel].color );
      }
    });
  }

  return errors;
};
