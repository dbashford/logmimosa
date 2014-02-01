exports.config =
  minMimosaVersion: "2.0.5"
  modules: ["coffeescript@1.1.0", "copy", "jshint"]
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