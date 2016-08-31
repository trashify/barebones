const pkg = require('./package.json'),
	gulp = require('gulp'),
	cssnano = require('gulp-cssnano'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	runSequence = require('run-sequence'),
	autoprefixer = require('gulp-autoprefixer'),
	size = require('gulp-size'),
	cssimport = require('gulp-cssimport'),
	purge = require('gulp-css-purge'),
  del = require('del'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	source = {
		dist: 'src/main.less',
		css: 'src/**/*.less',
		demo: ['demo/*.html', 'demo/**/*.css']
	},
	banner = ['/**',
	  ' * <%= pkg.name %> - <%= pkg.description %>',
	  ' * @version v<%= pkg.version %>',
	  ' * @link <%= pkg.homepage %>',
	  ' * @license <%= pkg.license %>',
	  ' */',
	].join('\n');

gulp.task('build', () => {
	return gulp.src(source.dist)
		.pipe(less())
    .pipe(cssimport())
		.pipe(purge())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(header(banner, { pkg }))
		.pipe(rename('barebones.css'))
		.pipe(gulp.dest('dist'))
		.pipe(cssnano())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('demo/css'))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
})

gulp.task('file-size', () => {
	return gulp.src('dist/*.min.css')
		.pipe(size({
			gzip: true,
			showFiles: true
		}))
})

gulp.task('clean', () => {
  return del('dist/**/*');
});

gulp.task('default', done => runSequence('clean', 'serve'))

gulp.task('serve', ['build'], function() {
  browserSync({
    server: './demo'
  })

  gulp.watch(source.css, ['build']);
  gulp.watch(source.demo).on('change', reload);
});
