var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    fs = require('fs'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect');

var sourcePath = 'src/';
var buildPath = 'build/';
var jadeFiles = sourcePath + '**/*.jade';
var lessFiles = sourcePath + '**/*.less';
var tsFiles = sourcePath + '**/*.ts';
var liveReloadPort = 8888;

function onError(err){
    console.log(err);
}

// JADE
gulp.task('jade', function(){
    var myLocals = JSON.parse(fs.readFileSync('jade-locals.json'));
    return gulp.src(jadeFiles)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(jade({
        locals: myLocals
    }))
    .pipe(gulp.dest(buildPath))
    .pipe(connect.reload());
});

// LESS
gulp.task('less', function(){
    return gulp.src(lessFiles)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(less({
        
    }))
    .pipe(gulp.dest(buildPath))
    .pipe(connect.reload());
});

// TypeScript
gulp.task('ts', function(){
    return gulp.src(tsFiles)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(ts({
        noImplicitAny: true
    }))
    .pipe(gulp.dest(buildPath))
    .pipe(connect.reload());
});

// Connect
gulp.task('connect', function(){
    connect.server({
        port: liveReloadPort,
        root: [buildPath],
        livereload: true
    })
});

// Watch
gulp.task('watch', function(){
   gulp.watch(jadeFiles, ['jade']);
   gulp.watch(lessFiles, ['less']);
   gulp.watch(tsFiles, ['ts']);
});

gulp.task('build', ['jade', 'less', 'ts']);
gulp.task('default', ['jade', 'less', 'ts', 'watch', 'connect']);