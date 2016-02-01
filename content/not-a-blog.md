# Not Writing a Blog Engine

- Take a bunch of static md files and convert them to HTML
- Why not Wordpress? - no user provided content, static is indefinitely more scalable
- Github backend covers versioning, online-editing with preview, contributions, even hosting
- Comments? (maybe via Disqus)
- Drawback: basically public domain, it's stupidly easy to clone
- Basically a gh-pages clone, but not directly depending on GH

## First Approaches

- Plain node.js - fs.readDir(), async iterations/mappings, transformations, etc. - callback hell,
  spaghetti code
- Promises - gets probably a lot more readable, still poorly structured code, hard to extend
- Unsatisfactory, lets take a step back

## Streams and Such

- Transform series of files into other files
- Generate index
- Easy to extend
- Can run on a CI server 
- Meet Gulp

## Gulp Basics

- Streaming model, uses virtual files (Vinyl), basically file content + metadata
- Plugins are factories that return an instance of duplex stream
- Use through as helper, 2 functions: `transform()` and `end()` (`'next'` and `'end'` events)
- Important: don't use arrow functions (needs `this` bound to stream instance)

## Markdown to HTML

```js
// transforms input files from markdown to html
function transform(file) {
  // store some metadata for index generation
  index.push({
    name: generateNewFilename(), 
    src: file.path,
    date: date
  })

  // transform markdown to html
  let newContent = marked(file.contents.toString('utf-8'))

  // the transformed file
  this.queue(new File({
    cwd: '.',
    base: '.',
    path: file.path.replace(/md$/, 'html'),
    contents: new Buffer(newContent)
  }))
},

// called at the end of the stream, i.e. all files are processed. generates an index.html file
// we could also use a template engine, e.g. handlebars to generate the index
function end() {
  // generate list in markdown  
  let list = index.map(obj => format('- [%s](./%s)', obj.name, obj.filename)).join('\n')

  // convert to html
  let content = marked(list)

  // queue file - `cwd` and `base` can be omitted
  this.queue(new File({
    path: 'index.html',
    contents: new Buffer(marked(md))
  }))
}
```

## Additional Tasks

- Embed HTML files into page template
- Beautify HTML (for the OCD)

## Deployment

- CI build via travis.yml
- Push result to gh-pages