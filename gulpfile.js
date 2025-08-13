const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');

// Paths
const paths = {
  pages: 'src/pages/**/*.+(njk|html)',
  templates: 'src',
  css: 'src/css/**/*.css',
  assets: 'src/assets/**/*'
};

// Clean dist
function clean() {
  return deleteAsync(['dist']);
}


// Compile Nunjucks
function nunjucks() {
  return gulp.src(paths.pages)
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: [paths.templates]
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Copy CSS
function css() {
  return gulp.src(paths.css)
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Copy assets
function assets() {
  return gulp.src('src/assets/**/*', { encoding: false }) // Don't interpret as text
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
  browserSync.init({
    server: { baseDir: 'dist' }
  });
  gulp.watch(paths.pages, nunjucks);
  gulp.watch(paths.templates + '/partials/**/*.+(njk|html)', nunjucks);
  gulp.watch(paths.css, css);
  gulp.watch(paths.assets, assets);
}

// Default task
exports.clean = clean;
exports.default = gulp.series(
  clean,
  gulp.parallel(nunjucks, css, assets),
  watchFiles
);
