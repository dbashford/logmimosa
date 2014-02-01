"use strict";

exports.defaults = function() {
  return {
    growl: {
      onStartup: false,
      onSuccess: {
        javascript: true,
        css: true,
        template: true,
        copy: true
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n"+
         "  # growl:\n" +
         "    # onStartup: false       # Controls whether or not to Growl when assets successfully\n" +
         "                            # compile/copy on startup, If you've got 100 CoffeeScript files,\n" +
         "                             # and you do a clean and then start watching, you'll get 100 Growl\n" +
         "                             # notifications.  This is set to false by default to prevent that.\n" +
         "                             # Growling for every successful file on startup can also cause\n" +
         "                           # EMFILE issues. See watch.throttle\n" +
         "    # onSuccess:             # Controls whether to Growl when assets successfully compile/copy\n" +
         "      # javascript: true     # growl on successful compilation? will always send on failure\n" +
         "      # css: true            # growl on successful compilation? will always send on failure\n" +
         "      # template: true       # growl on successful compilation? will always send on failure\n" +
         "      # copy: true           # growl on successful copy?\n";
};

exports.validate = function ( config, validators ) {
  var errors = [];
  if ( config.growl ) {
    if ( typeof( config.growl ) === "object" && !Array.isArray( config.growl ) ) {
      if ( config.growl.onStartup ) {
        if ( typeof( config.growl.onStartup ) !== "boolean" ) {
          errors.push( "growl.onStartup must be boolean" );
        }
      }

      if ( config.growl.onSuccess ) {
        var succ = config.growl.onSuccess;
        if ( typeof( succ ) === "object" && !Array.isArray( succ ) ) {
          ["javascript", "css", "template", "copy"].forEach( function( type ) {
            if ( succ[type] ) {
              if ( typeof( succ[type] ) !== "boolean" ) {
                errors.push( "growl.onSuccess.#{type} must be boolean." );
              }
            }
          });
        } else {
          errors.push( "growl.onSuccess must be an object." );
        }
      }
    } else {
      errors.push( "lint configuration must be an object." );
    }
  }
  return errors;
};