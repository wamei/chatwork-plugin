var gulp    = require("gulp");
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var fs = require('fs');

gulp.task('clean', function(){
    return gulp.src(['./built/*'], {read: false})
        .pipe(plugins.clean());
});

gulp.task('bundlejs', function() {
    return browserify('./src/main.js', { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./built'));
});

gulp.task('loadjs', function() {
    return browserify('./src/load.js', { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('load.js'))
        .pipe(gulp.dest('./built'));
});

gulp.task('css', function() {
    return gulp.src('css/*.css')
        .pipe(plugins.concatCss('bundle.css'))
        .pipe(gulp.dest('./built'));
});

gulp.task('manifest', function () {
    var json = JSON.parse(fs.readFileSync('./package.json'));
    return gulp.src("./manifest.json")
        .pipe(plugins.jsonEditor({
            'version': json.version,
            'description': json.description
        }))
        .pipe(gulp.dest("./"));
});

gulp.task('build', function() {
    return runSequence(
        'clean',
        ['bundlejs', 'loadjs', 'css', 'manifest']
    );
});
