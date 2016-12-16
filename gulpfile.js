const pkg = require('./package.json')
const gulp = require('gulp')
const cssnano = require('gulp-cssnano')
const less = require('gulp-less')
const rename = require('gulp-rename')
const header = require('gulp-header')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')
const size = require('gulp-size')
const cssimport = require('gulp-cssimport')
const purge = require('gulp-css-purge')
const del = require('del')
const browserSync = require('browser-sync')
const reload = browserSync.reload
const source = {
  dist: 'src/main.less',
  css: 'src/**/*.less',
  demo: ['demo/*.html', 'demo/**/*.css']
}
const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */'
].join('\n')

gulp.task('build', () => {
  return gulp.src(source.dist)
    .pipe(less())
    .pipe(cssimport())
    .pipe(purge())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(header(banner, {pkg}))
    .pipe(rename('barebones.css'))
    .pipe(gulp.dest('dist'))
    .pipe(cssnano())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(header(banner, {pkg}))
    .pipe(gulp.dest('demo/css'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}))
})

gulp.task('file-size', () => {
  return gulp.src('dist/*.min.css')
    .pipe(size({
      gzip: true,
      showFiles: true
    }))
})

gulp.task('clean', () => {
  return del('dist/**/*')
})

gulp.task('default', done => runSequence('clean', 'serve'))

gulp.task('serve', ['build'], function () {
  browserSync({
    server: './demo'
  })

  gulp.watch(source.css, ['build'])
  gulp.watch(source.demo).on('change', reload)
})
