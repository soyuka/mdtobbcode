var HTML2BBCode = require('html2bbcode')
var markdown = require('markdown-it')()
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var p = require('path')
Promise.longStackTraces()

var path = process.argv[2]

var files = fs.readdirAsync(path)
.filter(function(f) {
  return p.extname(f) == '.md'
})
.map(function(filename) {
  var from = p.resolve(path, filename)
  var basename = p.basename(from, p.extname(filename))
  var to = p.join(p.dirname(from), basename + '.bbcode')

  return fs.readFileAsync(from)
  .then(function(content) {

    content = content.toString()
    .replace(/`([^`\s].*?)`/g, '*$1*') //replace inline code

    content = markdown.render(content)
    //remove pre
    .replace(/<pre>/g, '')
    .replace(/<\/pre>/g, '')

    return fs.writeFileAsync(to, require('./lib/htmltobbcode.js')(content))
  })
  .catch(function(err) {
    console.error(err.stack)
    process.exit(1)
  })
})
.then(function() {
  process.exit(0)
})
.catch(function(err) {
  console.error(err.stack)
  process.exit(1)
})
