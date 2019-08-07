const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['dist/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            Browserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});


// Watch Sass & Serve
gulp.task('serve', gulp.series('sass', function() {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(['dist/scss/*.scss'], gulp.series('sass'));
    gulp.watch("dist/*.html").on('change', browserSync.reload);
}));

// Default Task
gulp.task('default', gulp.series('serve'));
