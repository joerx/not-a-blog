'use strict'

let path = require('path')
let File = require('vinyl')
let format = require('util').format
let through = require('through')
let marked = require('marked')
let moment = require('moment')

let gulpMarked = module.exports = function() {

  let index = []

  return through(
    function transform(file) {

      let basename = path.basename(file.path)
      // name = basename - ext
      let name = basename.replace(path.extname(file.path), '')
      // generate slug - lowercase, replace non-word chars. some files don't have name
      let slug = name ? name.replace(/[^\w]/g, '_').replace(/_+/, '_').toLowerCase() : ''
      // filename = slug + '.html'
      let filename = slug + '.html'

      index.push({
        name: name,
        src: file.path,  
        filename: filename
      })
      
      this.queue(new File({
        path: filename,
        contents: new Buffer(marked(file.contents.toString('utf-8')))
      }))
    },
    function end() {
      let list = index.map(obj => format('- [%s](./%s)', obj.name, obj.filename))
      let content = marked('# Not A Blog\n\n' + list)
      this.queue(new File({
        path: 'index.html',
        contents: new Buffer(content)
      }))
    }
  )
}
