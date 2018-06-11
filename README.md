# Strudel CLI

Command line scaffolding for Strudel.js

## Installation 

```bash
$ npm install strudel-cli --global
```

## Usage

```bash
$ strudel help
```

## Scaffolding new project

```bash
$ strudel new webpack my-new-project # Using webpack template
$ cd my-new-project
$ npm install
```

### Available templates

Template  | Usage
---       | ---
[Webpack](https://github.com/strudeljs/template-webpack)     | `strudel new webpack my-new-project`
[Clientlib](https://github.com/strudeljs/template-clientlib) | `strudel new clientlib my-new-clientlib`
[Theme](https://github.com/strudeljs/template-theme) | `strudel new theme my-theme-name`

## Generating components

```bash
$ strudel generate component my-new-component
$ strudel g component my-new-component #using the alias
# you can also generate component in sub-directories, run
$ strudel g component my-new-component components #will be generated in components subdirectory
```

## License

MIT

