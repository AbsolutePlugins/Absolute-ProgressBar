const gulp = require( 'gulp' );
const babel = require('gulp-babel');
const eslint = require( 'gulp-eslint' );
const terser = require( 'gulp-terser' );
const rename = require( 'gulp-rename' );
const { sass } = require("@mr-hope/gulp-sass");
const minifyCSS = require( 'gulp-clean-css' );
const autoprefixer = require( 'gulp-autoprefixer' );
const sourcemaps = require( 'gulp-sourcemaps' );

gulp.task('compile:js', () => {
	return gulp.src( 'src/js/**/*.js' )
	.pipe( sourcemaps.init( { largeFile: true } ) )
	.pipe( eslint() )
	.pipe( eslint.format() )
	.pipe( babel() )
    .pipe( sourcemaps.write( '/.' ) )
    .pipe( gulp.dest( 'dist/js' ) );
} );

gulp.task('minify:js', () => {
	return gulp.src( [
		'dist/js/**/*.js',
		'!dist/js/**/*.min.js',
	] )
	// .pipe( sourcemaps.init( { largeFile: true } ) )
	.pipe( terser( { format: { comments: false } } ) )
	.pipe( rename( { suffix: '.min' } ) )
	// .pipe( sourcemaps.write( '/.' ) )
	.pipe( gulp.dest( 'dist/js' ) );
} );

gulp.task('compile:scss', () => {
	return gulp.src( 'src/scss/**/*.scss' )
	.pipe( sourcemaps.init( { largeFile: true } ) )
	.pipe( sass().on( 'error', sass.logError ) )
	.pipe( autoprefixer() )
    .pipe( sourcemaps.write( '/.' ) )
	.pipe( gulp.dest( 'dist/css' ) );
});

gulp.task( 'minify:css', function () {
	return gulp.src( [
		'dist/css/**/*.css',
		'!dist/css/**/*.min.css'
	] )
	// .pipe( sourcemaps.init() )
	.pipe( minifyCSS() )
	.pipe( rename( { suffix: '.min' } ) )
	// .pipe( sourcemaps.write( '/.' ) )
	.pipe( gulp.dest( 'dist/css' ) );
} );

gulp.task( 'buildJs', gulp.series( 'compile:js', 'minify:js' ) );
gulp.task( 'buildCss', gulp.series( 'compile:scss', 'minify:css' ) );

gulp.task( 'build', gulp.series( 'buildJs', 'buildCss' ) );

gulp.task( 'watch', () => new Promise( ( resolve, reject ) => {
	try {
		gulp.watch( 'src/js/**/*.js', {ignoreInitial: true}, gulp.series('buildJs') );
		gulp.watch( 'src/scss/**/*.scss', {ignoreInitial: true}, gulp.series('buildCss') );
		resolve();
	} catch ( e ) {
		reject( e );
	}
} ) );
