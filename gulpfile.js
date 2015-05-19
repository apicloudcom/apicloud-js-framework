var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

gulp.task('copy', function() {
    gulp.src(['dev/widget/**/*','!dev/widget/lib/**'])
    .pipe(gulp.dest('release/widget'));
});
gulp.task('jsLibMin', function() {
    gulp.src('dev/widget/lib/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('release/widget/lib'));
});
gulp.task('jsmin', ['copy','jsLibMin'], function() {
    gulp.src('dev/api*.js')
    .pipe(uglify({outSourceMap: false}))
    .pipe(gulp.dest('release'));
});
gulp.task('cssmin', function() {
    gulp.src('dev/api.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('release'));
});
gulp.task('default', ['jsmin','cssmin']);