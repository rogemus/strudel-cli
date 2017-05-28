const async = require('async');
const inquirer = require('inquirer');
const evaluate = require('./eval');

const promptMapping = {
  string: 'input',
  boolean: 'confirm'
};

const prompt = (data, key, prompt, done) => {
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done();
  }

  var promptDefault = prompt.default;
  if (typeof prompt.default === 'function') {
    promptDefault = function () {
      return prompt.default.bind(this)(data)
    }
  }

  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: promptDefault,
    choices: prompt.choices || [],
    validate: prompt.validate || function () { return true }
  }]).then(function (answers) {
    if (Array.isArray(answers[key])) {
      data[key] = {}
      answers[key].forEach(function (multiChoiceAnswer) {
        data[key][multiChoiceAnswer] = true
      });
    } else if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"');
    } else {
      data[key] = answers[key];
    }
    done();
  });
};

module.exports = function (prompts, data, done) {
  async.eachSeries(Object.keys(prompts), function (key, next) {
    prompt(data, key, prompts[key], next);
  }, done);
};
