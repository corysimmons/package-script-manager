// psm.js

// Easily alter your project structure
const distDir = 'dist'
const srcDir = 'src'
const jsDist = `${distDir}/js`
const cssBundle = 'site.min.css'
const jsBundle = 'site.min.js'
const jsMap = 'site.min.js.map'

module.exports = {

  "clean": `rimraf ${jsDist}/* && mkdirp ${jsDist}/css && mkdir ${jsDist}/js`,

  "autoprefixer": `postcss -u autoprefixer -r ${jsDist}/css/*`,

  "lint": `eslint ${srcDir}/js/*.js`,

  // Uglify/minify JS https://github.com/mishoo/UglifyJS
  "uglify": `uglifyjs ${srcDir}/js/**/*.js -m -o ${jsDist}/js/${jsBundle} --source-map ${jsDist}/js/${jsMap}`,

  // Losslessly compress imagery https://github.com/imagemin/imagemin-cli
  // We could watch this with Chokidar, but I wanted to demonstrate you can
  // perform tasks sequentially, as well as in parallel, very easily.
  "imagemin": `imagemin ${srcDir}/images/* -o ${jsDist}/images`,

  // Fire up a really powerful dev server https://www.browsersync.io/docs/command-line
  "start": `npm run build:all && browser-sync start --server ${srcDir} --files ${srcDir}`,

  "build:html": `copyfiles -f ${srcDir}/*.html ${jsDist}/`,

  "build:css": `cat ${srcDir}/css/**/*.css | cleancss -o ${jsDist}/css/${cssBundle} -s && npm run autoprefixer`,

  "build:js": `npm run lint && npm run uglify`,

  "build:images": `npm run imagemin`,

  "build:all": `npm run clean && npm run build:html && npm run build:css && npm run build:js && npm run build:images`,

  "watch:html": `onchange \"${srcDir}/*.html\" -- npm run build:html`,

  "watch:css": `onchange \"${srcDir}/css\" -- npm run build:css`,

  "watch:js": `onchange \"${srcDir}/js\" -- npm run build:js`,

  "watch:images": `onchange \"${srcDir}/images\" -- npm run build:images`,

  // Compresses imagery once on startup, then runs other optimizations and the development server in parallel.
  // https://github.com/mysticatea/npm-run-all
  "watch:all": `npm-run-all -p start watch:html watch:css watch:js watch:images`,

  // After installing our dependencies run the psm to rebuild
  // our package.json based on the psm.js file
  "postinstall": `psm psm.js package.json`
}