var babel = require('gulp-babel')
var es = require('event-stream')
var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')


gulp.task('data', () => {
  return gulp.src('../../data/**')
    .pipe(gulp.dest('../../build/web/data'))
})

gulp.task('script', () => {
  return es.merge([
    gulp.src('script/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015']
      })),
    gulp.src('vendor/script/**/*.js')
      .pipe(sourcemaps.init())
  ]).pipe(uglify())
    .pipe(sourcemaps.write('../sourcemaps'))
    .pipe(gulp.dest('../../build/web/script'))
})

gulp.task('style', () => {
  return gulp.src('style/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('../sourcemaps'))
    .pipe(gulp.dest('../../build/web/style'))
})

gulp.task('html', () => {
  return gulp.src(['**/*.html', '!node_modules/**'])
    .pipe(gulp.dest('../../build/web'))
})

gulp.task('default', gulp.parallel('data', 'html', 'script', 'style'));
