'use strict'

let fs = require('fs')
let assert = require('assert')
let File = require('vinyl')
let format = require('util').format
let through = require('through')
let handlebars = require('handlebars')

module.exports = function decorate(options) {

  assert(options.template, 'Template must be given')

  return through(
    function transform(file) {
      fs.readFile(options.template, (err, data) => {
        if (err) this.emit('error', err)
        else {
          let $t = handlebars.compile(data.toString('utf-8'), {noEscape: true})
          let content = file.contents.toString('utf-8')
          this.queue(new File({
            path: file.path,
            contents: new Buffer($t({content}))
          }))
        }
      }) 
    }
  )
}
