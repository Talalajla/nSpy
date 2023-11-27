const gulp = require('gulp');
const terser = require('gulp-terser');

gulp.task('minify-js', function () {
    return gulp.src('src/*.js')
        .pipe(terser())
        .pipe(gulp.dest('dist'));
});