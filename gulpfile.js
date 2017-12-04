'use strict';
var gulp = require('gulp');
var config = require('./gulp.config')();
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var del = require('del');
var util = require('gulp-util');
var $ = require('gulp-load-plugins')({ lazy: true });
var uglify = require('gulp-uglify');
var sourcemap = require('gulp-sourcemaps');


gulp.task('browserSync', ['nodemon'], function() {
    return browserSync({
        proxy: 'localhost:5000', // local node app address
        port: 3000, // use *different* port than above
        notify: true,
        ghostMode: {
            click: true,
            location: false,
            forms: true,
            scroll: true
        },
        reloadDelay: 1000,
        logLevel: 'debug'
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;

    return $.nodemon({
        script: 'index.js'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});



gulp.task('default', function(callback) {
    runSequence(['styles', 'browserSync', 'watch'],
        callback
    );
});


gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', ['styles']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch(['app/js/*.js', './*.js'], ['vet']);
});


gulp.task('styles', function() {
    util.log(util.colors.blue('Sass styles in the works'));
    return gulp.src('app/scss/*.scss')
        .pipe($.wait())
        .pipe($.plumber())
        .pipe($.sass({
            includePaths: ['node_modules/susy/sass', 'node_modules/susy/sass/plugins'],
            errLogToConsole: true,
            sync: true
        }))
        .pipe($.autoprefixer())
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }))
        .pipe(gulp.dest('app/css'));
});


gulp.task('vet', function() {
    return gulp.src(['app/**/*.js',
            './*.js'
        ])
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }));
});




gulp.task('images', function() {
    return gulp.src(['app/images/**/*.+(png|jpg|jpeg|gif|svg)'])
        .pipe(gulp.dest('dist/images'));
});





// Copying fonts 
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});








gulp.task('useref', function() {

    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe(gulp.dest('dist'));
});

// Cleaning 
gulp.task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return $.cache.clearAll(cb);
    });
});


gulp.task('build', function(callback) {
    runSequence(
        'clean:dist', ['styles', 'useref', 'images', 'fonts'],
        callback
    );
});
gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});