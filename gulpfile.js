'use strict';

const   glob = require('glob'),
        gulp = require('gulp'),
        gutil = require('gutil'),
        print = require('gulp-print'),
        file = require('gulp-file'),
        concat = require('gulp-concat'),
        libsass = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        autoprefixer = require('gulp-autoprefixer'),
        sassdoc = require('sassdoc'),
        mergeStream = require('merge-stream'),
        browserSync = require('browser-sync').create();


let config = {
        libsass: {
            // outputStyle: 'expanded',
            outputStyle: 'compressed',
            sourceMapContents: true
        },
        autoprefixer: {
            cascade: true,
            browsers: ['last 2 versions', '> 2%', 'ie 11']
        }
    },
    srcfiles = [
        'src/scss/_config.scss',
        'src/scss/_helpers.scss',
        'src/scss/layout.scss'
    ],
    filecontents = '';

for (let file of srcfiles) {
    filecontents += '@import "' + file + '";\n';
}

gulp.task('compile', () => {
    return gulp
            .src('') // source is virtiual file
            .pipe(sourcemaps.init()).on('error', gutil.log)
            .pipe(file('kemet.min.css', filecontents)).on('error', gutil.log)
            .pipe(libsass(config.libsass)).on('error', gutil.log)
            .pipe(autoprefixer(config.autoprefixer)).on('error', gutil.log)
            .pipe(sourcemaps.write('.')).on('error', gutil.log)
            .pipe(gulp.dest('dist/css'));
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./dist",
            directory: true
        },
        port: 3030,
        ui: {
            port: 3031
        }
    });
});

gulp.task('dist', () => {

    var plainFiles,
        styleFile,
        demoFiles;


    plainFiles = gulp
                .src('src/scss/**/*.scss')
                .pipe(gulp.dest('./dist/scss'));

    styleFile = gulp
                .src(srcfiles)
                .pipe(concat('kemet-styles.scss'))
                .pipe(gulp.dest('./dist/kemet-styles/'));

    demoFiles = gulp
                .src('src/demo/**')
                .pipe(gulp.dest('./dist/demo'));


    return mergeStream(plainFiles, styleFile, demoFiles);
});

gulp.task('docs', () => {
    var options = {
        dest: 'docs'
    }

    return gulp
        .src('src/scss/**/*.scss')
        .pipe(sassdoc(options));
});

gulp.task('develop', ['serve'], () => {

    gulp.watch(['src/**'], ['compile', 'dist']);

});
