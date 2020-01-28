var gulp = require('gulp');
var pug = require('gulp-pug');
var EmailBuilder = require('gulp-email-builder');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');

var options = {
    // encodeSpecialChars: true
};
var builder = EmailBuilder(options);

function plumberHandler() {
    return plumber({
        errorHandler: function (err) {
            console.error(err);
            this.emit('end');
        }
    });
};


var server = browserSync.create();
const reload = () => server.reload({ stream: true });

gulp.task('server', function() {
    server.init({
        server: {
            baseDir: './build',
            directory: true
        }
    });
});


gulp.task('template', function() {
    return gulp.src('src/index.pug')
        .pipe(plumberHandler())
        .pipe(pug({
            cache: false,
            pretty: '  ',
            locals: {}
        }))
        .pipe(builder.inlineCss())
        .pipe(gulp.dest('./build/'))
        .pipe(reload())
});


gulp.task('images', function() {
    var dest = 'build/images/**/*.*';
    return gulp.src('src/images/**/*.*')
        .pipe(plumberHandler())
        .pipe(newer(dest))
        .pipe(imagemin())
        .pipe(gulp.dest(dest))
        .pipe(reload())
});


gulp.task('watch', function(done) {
    gulp.watch('src/**/*.*', gulp.series('template'));
    gulp.watch('src/images/**/*.*', gulp.series('images'));
    done();
});


gulp.task('build', gulp.series('images', 'template'));
gulp.task('default', gulp.series('build', 'watch', 'server'));