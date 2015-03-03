var gulp = require('gulp');
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');

gulp.task('css', function(){
	return gulp.src(['./dev/css/*.css'])
		.pipe(minifyCSS())
		.pipe(gulp.dest('./www/css'));
})

gulp.task('libcss', function(){
	return gulp.src(['./dev/lib/css/*.css'])
		.pipe(minifyCSS())
		.pipe(gulp.dest('./www/lib/css'));
})

gulp.task('libjs', function() {
    gulp.src("./dev/lib/js/*.js")
    .pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('./www/lib/js/'));  
});

gulp.task('js', function(){
	return gulp.src(['./dev/js/app.js','./dev/js/controllers/*.js','./dev/js/services/*.js'])
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('./www/js'))
});

gulp.task('index', function(){
	var opts = {
		empty:true,
		spare:true,
		quotes:true,
		conditionals:true
	};
	gulp.src("./dev/index.html")
	.pipe(minifyHTML(opts))
  .pipe(gulp.dest('./www/'));
});


gulp.task('html', function(){
	var opts = {
		empty:true,
		spare:true,
		quotes:true,
		conditionals:true
	};
	gulp.src("./dev/templates/*.html")
	.pipe(minifyHTML(opts))
    .pipe(gulp.dest('./www/templates/'));
});

gulp.task('watch', function(){

	gulp.watch(['./dev/css/*.css'], ['css']);
	gulp.watch(['./dev/lib/css/*.css'], ['libcss']);
	gulp.watch(['./dev/lib/js/*.js'], ['libjs']);

	gulp.watch(['./dev/js/app.js','./dev/js/controllers/*.js','./dev/js/services/*.js'], ['js']);

	gulp.watch(['./dev/templates/*.html'], ['html']);

	gulp.watch(['./dev/index.html'], ['index']);

});






