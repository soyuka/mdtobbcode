var htmlparser = require('htmlparser2')

var transform = {
  code: {tag: 'code'},
  a: {tag: 'url', attr: 'href'},
  ul: {tag: 'list', attr: '*'},
  ol: {tag: 'list', attr: '1'},
  li: {tag: '*'},
  img: {tag: 'img', attr: 'src'},
  sup: {tag: 'sup'},
  ins: {tag: 'sub'},
  u: {tag: 'u'},
  blockquote: {tag: 'quote'},
  strike: {tag: 's'}
}

for (var i = 1, len = 6; i <= len; i++) {
  transform['h'+i] = {tag: 'h', newline: true}
}

var bold = ['strong', 'b']
for(var i in bold) {
  transform[bold[i]] = {tag: 'b'}
}

var italic = ['i', 'em']
for(var i in italic) {
  transform[italic[i]] = {tag: 'i'}
}

var toTag = function(tag, attrs, close) {
  var str = tag.newline ? '\n' : ''
  str += '[' 
  str += close ? '/' : '' 
  str += tag.tag

  if(close) {
    str += ']' 
    return str
  }

  if(attrs[tag.attr]) {
    str += '=' + attrs[tag.attr]
  } else if(tag.attr) {
    str += '=' + tag.attr 
  }
  
  str += ']' 

  return str
}

module.exports = function(data) {

  var bbcode = ''
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      if(transform[name]) {
        bbcode += toTag(transform[name], attribs)
      }
    },
    ontext: function(text) {
      bbcode += text
    },
    onclosetag: function(name) {
      if(transform[name])
        bbcode += toTag(transform[name], {}, true)
    }
  }, {decodeEntities: true})

  parser.write(data)
  parser.end()

  return bbcode
}
