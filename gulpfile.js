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
        mergeStream = require('merge-stream');


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


gulp.task('dist', () => {

    var plainFiles,
        styleFile;


    plainFiles = gulp
                .src('src/scss/**/*.scss')
                .pipe(gulp.dest('./dist/scss'));

    styleFile = gulp
                .src(srcfiles)
                .pipe(concat('kemet-styles.scss'))
                .pipe(gulp.dest('./dist/kemet-styles/'));


    return mergeStream(plainFiles, styleFile);
});


gulp.task('docs', () => {
    var options = {
        dest: 'docs'
    }

    return gulp
        .src('src/scss/**/*.scss')
        .pipe(sassdoc(options));
});

