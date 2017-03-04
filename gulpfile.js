// Original creator: David Vega. I just modified

const fs = require('fs'),
      path = require('path'),
      gulp = require('gulp'),
      libsass = require('node-sass'),
      mapStream = require('map-stream'),
      exec = require('child_process').exec;

//This is currently not used. But you can enable by uncommenting
// " //return gulp.src([basePath+ext,...excludeDirs])" above the return.
// var excludeDirs = [`!${basePath}/bower_components/${ext}`, `!${basePath}/images/${ext}`]

gulp.task('sass:inject', function () {
    return gulp
        .src(['./*.html'])
        .pipe(mapStream(function (file, cb) {
            var startStyle = "<!-- Start Style -->",
                endStyle = "<!-- End Style -->",
                regEx = new RegExp(startStyle + "[\\s\\S]*" + endStyle, "g"),
                contents = file.contents.toString(); // Converts file buffer into a string

            // Checks if the RegEx exists in the file. If not, don't do anything and return.
            if (!regEx.test(contents)) return cb();

            var scssFile = file.path.replace(/\.html$/i, '.scss'); // get .scss with name file name as sty

            fs.readFile(scssFile, function (err, data) {

                // if error or there is no sass return null.
                if (err || !data) return cb();

                libsass.render({
                    data: data.toString(),
                    // includePaths: [path.join('app', 'style/')],
                    outputStyle: 'compressed'
                }, function (err, compiledScss) {

                    // if error or there is no sass return
                    if (err || !compiledScss) return cb();

                    // creat the style block
                    var injectSassContent = startStyle + "<style>" + compiledScss.css.toString() + "</style>" + endStyle;

                    // replace everything between <!-- Start Style --> and <!-- End Style -->
                    file.contents = new Buffer(contents.replace(regEx, injectSassContent), 'binary');

                    // this return is necessary, or the modified map will not be modified
                    return cb(null, file);
                });
            });
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('sass:compile', function() {
    exec('npm run sass', (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
    });
});

gulp.task('sass:watch', function () {
    gulp.watch(['./*.scss'], ["sass:inject"]);
});
