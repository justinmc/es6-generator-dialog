var gulp = require('gulp');
 
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserify = require('gulp-browserify');
var babel = require('babelify');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
 
var bases = {
  app: 'app/',
  dist: 'dist/',
};
 
var paths = {
  scripts: ['scripts/**/*.js', '!scripts/vendor/**/*.js'],
  scriptsVendor: ['scripts/vendor/**/*.js'],
  json: ['scripts/**/*.json'],
  styles: ['styles/**/*.css'],
  html: ['index.html', '404.html'],
  images: ['images/**/*.png', 'images/**/*.jpeg', 'images/**/*.jpg', '!images/source/**/*'],
  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico', '*.ttf'],
};
 
// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist + '*')
    .pipe(clean());
});
 
// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean', 'imagemin'], function() {
  gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  gulp.src('scripts/main.js', {cwd: bases.app})
    .pipe(browserify({
      debug: '!gulp.env.production',
      transform: babel
    }))
    .pipe(concat('app.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(bases.dist + 'scripts/'))
    .pipe(connect.reload());
});
 
// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  return gulp.src(paths.images, {cwd: bases.app})
    //.pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'images/'));
});
 
// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy html
  gulp.src(paths.html, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));

  // Copy styles
  gulp.src(paths.styles, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'styles'));

  // Copy all json
  gulp.src(paths.json, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'scripts'));

  // Copy vendor js
  gulp.src(paths.scriptsVendor, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'scripts/vendor'));

  // Copy extra html5bp files
  gulp.src(paths.extras, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));
});
 
// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'imagemin', 'copy']);

// A development task to run anytime a file changes
gulp.task('watch', function() {
  gulp.watch('app/**/*', ['default']);
});

gulp.task('serve', ['default', 'watch'], function() {
  return connect.server({
    root: 'dist',
    livereload: true
  });
});
