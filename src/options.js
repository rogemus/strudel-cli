const path = require('path');
const metadata = require('read-metadata');
const getGitUser = require('./git-user')

const getConfig = (dir) => {
  const json = path.join(dir, 'config.json');
  return metadata.sync(json);
}

const setDefault = (opts, key, val) => {
  var prompts = opts.prompts || (opts.prompts = {});
  prompts[key]['default'] = val;
}

module.exports = function (name, dir) {
  const opts = getConfig(dir);
  const author = getGitUser();

  setDefault(opts, 'name', name);

  if (author) {
    setDefault(opts, 'author', author)
  }

  return opts;
};
