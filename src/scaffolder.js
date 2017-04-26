const path = require('path');
const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');

const scaffold = (name, src, dest) => {
  var metalsmith = Metalsmith(path.join(src, 'template'));
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  });

  console.log(name, src, dest);

  metalsmith.clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function (err, files) {
      console.log(files);
    })

  return data
};

module.exports = scaffold;
