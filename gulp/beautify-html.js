'use strict'

let File = require('vinyl')
let through = require('through')
let beautify = require('js-beautify').html

module.exports = function beautifyHtml() {
  return through(
    function transform(file) {
      let data = new Buffer(beautify(file.contents.toString('utf-8')))
      this.queue(new File({
        path: file.path,
        contents: data
      }))
    }
  )
}
