const render = require('consolidate').handlebars.render;
const fs = require('fs');

const className = (s) => {
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s.replace(/(\-\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

const generate = (name, src, dest, done) => {
  var file = fs.readFileSync(src);

  render(file.toString(), {
    name: name,
    className: className(name)
  }, function (err, res) {
    fs.writeFileSync(dest + '/' + name + '.js', res);
    done();
  })

}

module.exports = generate;
