const path = require('path');
const minimatch = require('minimatch');
const Metalsmith = require('metalsmith');
const async = require('async');
const render = require('consolidate').handlebars.render;
const evaluate = require('./eval');
const prompt = require('./prompt');
const getOptions = require('./options');

const scaffold = (name, src, dest, done) => {
  var opts = getOptions(name, src);
  var metalsmith = Metalsmith(path.join(src, 'template'));
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  });

  metalsmith.use(promptQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplates(opts.skipInterpolation));

  metalsmith.clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function (err) {
      done(err);
    })

  return data;
};

const promptQuestions = (prompts) => {
  return function (files, metalsmith, done) {
    prompt(prompts, metalsmith.metadata(), done);
  }
};

const filter = (files, filters, data, done) => {
    if (!filters) {
      return done();
    }

    var fileNames = Object.keys(files);

    Object.keys(filters).forEach(function (glob) {
      fileNames.forEach(function (file) {
        if (match(file, glob, { dot: true })) {
          var condition = filters[glob]
          if (!evaluate(condition, data)) {
            delete files[file];
          }
        }
      });
    });

    done();
};

const renderTemplates = (skipInterpolation) => {
  skipInterpolation = typeof skipInterpolation === 'string' ? [skipInterpolation] : skipInterpolation;

  return function (files, metalsmith, done) {
    var keys = Object.keys(files);
    var metalsmithMetadata = metalsmith.metadata();

    async.each(keys, function (file, next) {
      if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
        return next();
      }

      var str = files[file].contents.toString();

      if (!/{{([^{}]+)}}/g.test(str)) {
        return next();
      }

      render(str, metalsmithMetadata, function (err, res) {
        if (err) {
          err.message = `[${file}] ${err.message}`;
          return next(err);
        }
        files[file].contents = new Buffer(res);
        next();
      });

    }, done);
  }
};

const filterFiles = (filters) => {
  return function (files, metalsmith, done) {
    filter(files, filters, metalsmith.metadata(), done)
  }
};

module.exports = scaffold;
