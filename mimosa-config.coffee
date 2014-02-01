exports.config =
  #minMimosaVersion: "2.0.5"
  modules: ["coffeescript", "copy", "jshint"]
  coffeescript:
    options:
      sourceMap: false
  watch:
    sourceDir: "src"
    compiledDir: "lib"
    javascriptDir: null
  jshint:
    rules:
      node: true