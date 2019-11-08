// ==========================================================================
// Gulp build script
// ==========================================================================
/* global require, __dirname */
/* eslint no-console: "off" */

const path = require('path');
const gulp = require('gulp');

// JavaScript
const terser = require('gulp-terser');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('./scripts/rollup-replace.js');
const json = require('rollup-plugin-json');

// CSS
const sass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefix = require('gulp-autoprefixer');

// Images
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');

// Utils
const del = require('del');
const filter = require('gulp-filter');
const header = require('gulp-header');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');

const pkg = require('./package.json');
const build = require('./build.json');

const { browserslist: browsers } = pkg;

const minSuffix = '.min';

// Paths
const paths = {
  plyr: {
    // Source paths
    src: {
      sass: path.join(__dirname, 'src/*.scss'),
      js: path.join(__dirname, 'src/*.js'),
      sprite: path.join(__dirname, 'src/*.svg')
    },

    // Output paths
    output: path.join(__dirname, 'dist/')
  },
  upload: [
    path.join(__dirname, `dist/*${minSuffix}.*`),
    path.join(__dirname, 'dist/*.css'),
    path.join(__dirname, 'dist/*.svg')
  ]
};

// Task arrays
const tasks = {
  css: [],
  js: [],
  sprite: [],
  clean: 'clean'
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Clean out /dist
gulp.task(tasks.clean, done => {
  const dirs = [paths.plyr.output].map(dir => path.join(dir, '**/*'));

  // Don't delete the mp4
  dirs.push(`!${path.join(paths.plyr.output, '**/*.mp4')}`);

  del(dirs);

  done();
});

// JavaScript
Object.entries(build.js).forEach(([filename, entry]) => {
  entry.formats.forEach(format => {
    const name = `js:${filename}:${format}`;

    tasks.js.push(name);
    const polyfill = filename.includes('polyfilled');
    const extension = format === 'es' ? 'es.js' : 'js';
    const external = (id) => Object.keys(entry.externals[format]).some((ext) => format === 'es' ? id.startsWith(ext) : id === ext);

    gulp.task(name, () =>
      gulp
        .src(entry.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rollup(
          {
            plugins: [
              resolve({
                mainFields: ['browser', 'module', 'jsnext:main', 'main'],
                dedupe: (id) => Object.keys(entry.externals[format]).some((ext) => id.startsWith(ext))
              }),
              json(),
              replace,
              commonjs(),
              babel({
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      // debug: true,
                      useBuiltIns: polyfill ? 'usage' : false,
                      corejs: polyfill ? 3 : undefined
                    }
                  ]
                ],
                babelrc: false,
                exclude: path.join(process.cwd(), 'node_modules/**'),
                compact: false
              })
            ],
            external
          },
          {
            name: entry.namespace,
            format,
            globals: entry.externals[format],
            file: `dist/${pkg.name}.js`
          },
        ),)
        .pipe(header(`/*! @name ${pkg.name} @version ${pkg.version} @license ${pkg.license} */\r\n`))
        .pipe(rename({
          extname: `.${extension}`
        }),)
        .pipe(gulp.dest(entry.dist))
        .pipe(filter(`**/${pkg.name}.js`))
        .pipe(terser())
        .pipe(rename({ suffix: minSuffix }))
        .pipe(size(sizeOptions))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(entry.dist)),);
  });
});

// CSS
Object.entries(build.css).forEach(([filename, entry]) => {
  const name = `css:${filename}`;

  tasks.css.push(name);

  gulp.task(name, () =>
    gulp
      .src(entry.src)
      .pipe(plumber())
      .pipe(sass())
      .pipe(prefix(browsers, {
        cascade: false
      }),)
      .pipe(clean())
      .pipe(size(sizeOptions))
      .pipe(rename({
        basename: `${pkg.name}`
      }),)
      .pipe(gulp.dest(entry.dist)),);
});

// SVG Sprites
Object.entries(build.sprite).forEach(([filename, entry]) => {
  const name = `sprite:${filename}`;

  tasks.sprite.push(name);

  gulp.task(name, () =>
    gulp
      .src(entry.src)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(svgstore())
      .pipe(rename({ basename: path.parse(filename).name }))
      .pipe(size(sizeOptions))
      .pipe(gulp.dest(entry.dist)),);
});

// Build all JS
gulp.task('js', () => gulp.parallel(...tasks.js));

// Watch for file changes
gulp.task('watch', () => {
  // Plyr core
  gulp.watch(paths.plyr.src.js, gulp.parallel(...tasks.js));
  gulp.watch(paths.plyr.src.sass, gulp.parallel(...tasks.css));
  gulp.watch(paths.plyr.src.sprite, gulp.parallel(...tasks.sprite));
});

// Build distribution
gulp.task('build', gulp.series(tasks.clean, gulp.parallel(...tasks.js, ...tasks.css, ...tasks.sprite)));

// Default gulp task
gulp.task('default', gulp.series('build', 'watch'));
