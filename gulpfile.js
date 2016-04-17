var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    fs = require('fs'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    nodemon = require('gulp-nodemon'),
    webserver = require('gulp-webserver'),
    spawn = require('child_process').spawn,
    node;

var sourcePath = 'src/';
var buildPath = 'build/';
var jadeFiles = sourcePath + '**/*.jade';
var lessFiles = sourcePath + '**/*.less';
var tsFiles = sourcePath + '**/*.ts';
var tsDefinitionFiles = 'typings/**/*.ts';
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
    .pipe(gulp.dest(buildPath));
    //.pipe(gulp.run('server'));
    //.pipe(connect.reload());
});

// LESS
gulp.task('less', function(){
    return gulp.src(lessFiles)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(less({
        
    }))
    .pipe(gulp.dest(buildPath));
    //.pipe(gulp.run('server'));
    //.pipe(connect.reload());
});

// TypeScript
gulp.task('ts', function(){
    var tsConfig = JSON.parse(fs.readFileSync('tsconfig.json'));
    return gulp.src(tsFiles)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(ts(tsConfig))
    .pipe(gulp.dest(buildPath));
    //.pipe(connect.reload());
});

// Watch
gulp.task('watch', function(){
   gulp.watch(jadeFiles, ['jade']);
   gulp.watch(lessFiles, ['less']);
   gulp.watch(tsFiles, ['ts']);
});

// Connect OBSOLETE
gulp.task('connect', function(){
    connect.server({
        root: ['localhost:1234'],
        livereload: true,
        port: liveReloadPort
    });
});

gulp.task('reload', function(){
    connect.reload();
});

// Nodemon OBSOLETE
gulp.task('run', function(){
    nodemon({
        cwd: buildPath,
        script: 'app.js',
        env: { 'NODE_ENV': 'development' }
    })
    .on('restart', function(){
        console.log('Node restarted!');
        connect.reload();
    });
});

// Webserver
gulp.task('webserver', function(){
    gulp.src(buildPath+'app.js')
    .pipe(webserver({
        livereload: true,
        open: false,
        port: 1234,
        path: buildPath
    }));
});

// custom server
gulp.task('server', function(){
    if(node) node.kill();
    node = spawn('node', ['app.js'], {
        cwd: buildPath,
        stdio: 'inherit'
    });
    node.on('close', function(code){
        if(code === 8){
            gulp.log('Error detected, waiting for changes...');
        }
    })
});


// REST

gulp.task('debug', function(){
    console.log('gulp is running in: ' + gulp.cwd);
});

gulp.task('build', ['jade', 'less', 'ts']);
gulp.task('default', ['build', 'watch', 'server']);