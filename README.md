# Package Script Manager

Like package scripts? Dislike that they're in JSON?

psm adds Javascript to your `package.json` scripts.

## Installation
`yarn add --dev package-script-manager` (or `npm install --devDependencies package-script-manager` if you're not hip on yarn yet)

## Usage
- Create `psm.js` as a sibling to `package.json`. Inside of `psm.js`, `module.exports` an object.
- Migrate all your scripts from `package.json` to that object in `psm.js`
- **Warning:** psm is destructive. It will replace whatever scripts you have in `package.json` with the scripts from `psm.js`. Copy your `package.json` `"scripts"` over somewhere safe before proceeding.
- Run `node_modules/.bin/psm`
- psm will copy the scripts from `psm.js` to `package.json`, as well as create a couple helper scripts (`psm`, `psm:watch`)
- Do whatever JS stuff you wanted to do in `psm.js`
- `npm run psm` or `npm run psm:watch`

## Contrived Example
**Note:** `static-minifier` isn't referencing a real npm package.

```js
// psm.js
const src = 'source'
const minifyable = [
  `${src}/css`,
  `${src}/js`,
  `${src}/img`
]

module.exports = {
  minify: `static-minifier --watch --input-dirs=${minifyable.join(',')} --output-dir=dist`,
  start: `npm-run-all -p minify psm:watch`
}
```

```js
// package.json
{
  // ...
  "scripts": {
    "minify": "static-minifier --watch --input-dirs=source/css,source/js,source/img --output-dir=dist",
    "start": "npm-run-all -p minify psm:watch",
    "psm": "psm psm.js package.json",
    "psm:watch": "chokidar psm.js -c 'npm run psm'"
  }
  // ...
}
```

## CLI API
For initialization, you'll need to explicitly use `node_modules/.bin/psm`. This will run psm; migrate scripts from the `[input]` (`psm.js` by default) to the `[target]` (`package.json` by default); and create a few helper scripts (`psm`, `psm:watch`) configured with the same `[input]` and `[target]`.
- `$ node_modules/.bin/psm [input] [target]`
- `$ node_modules/.bin/psm my-cool-scripts.js package.dry-run.json`

After psm has been initialized, you can use `npm run psm` to manually run psm, or `npm run psm:watch` to migrate scripts on `[input]` changes.

## Why?
I saw a bunch of people saying other task runners were more configurable because they allowed for things like variables. I've ran across this dilemma a few times, but I 💗 CLI, so this plugin quashes those issues.

To be quite honest, I've forgotten what those situations were, but now I can turn to this tool when they rear their ugly heads, and since it's so low-level, it's very extendable with plain Node as well (without needing a plugin-specific API layer like other task runners).

I'm excited to see if the community can come up with good uses for psm. I _feel_ like this might be a cool thing. I'll probably create an org for this and collect plugins there.

Sorry if it's silly and I'm just further polluting the ecosystem. 😐
