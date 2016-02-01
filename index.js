'use strict'

let gulp = require('gulp')
let marked = require('./gulp/marked')
let decorate = require('./gulp/decorate')
let beautifyHtml = require('./gulp/beautify-html')

// const BASE_DIR = './content/'
const OUT_DIR = './public/sites/'
const TEMPLATE = './template.html'

gulp.src(['./content/**/*.md'])
  .pipe(marked())
  .pipe(decorate({template: TEMPLATE}))
  .pipe(beautifyHtml())
  .pipe(gulp.dest(OUT_DIR))
