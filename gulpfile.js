// Load Gulp and all of our Gulp plugins
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// Load other npm modules
const del = require('del');
const glob = require('glob');
const path = require('path');
const isparta = require('isparta');
const babelify = require('babelify');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const rollup = require('rollup');
const browserify = require('browserify');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const awspublish = require('gulp-awspublish');
const KarmaServer = require('karma').Server;
const esdoc = require("gulp-esdoc");

// Gather the library data from `package.json`
const manifest = require('./package.json');
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));
const conf = require('./config.json');
const _ = require('lodash');
const shell = require('gulp-shell');

// JS files that should be watched
const mainFiles = ['src/**/*.js', 'src/classes/**/*.js'];

// Locations/Files to watch along with main files
const watchFiles = ['package.json', '**/.eslintrc', '.jscsrc', 'test/**/*'];
const ignoreFiles = ['dist/**/*.js', 'examples/**', 'node_modules/**'].map(function(location){return '!' + location;});

//Create CDN Publisher
var publisher = CDNPublisher();

gulp.task('build:main', ['lint-src', 'clean'], function(done) {
  rollup.rollup({
    entry: config.entryFileName,
    external:['lodash', 'firebase'],
  }).then(function(bundle) {
    var res = bundle.generate({
      // Don't worry about the fact that the source map is inlined at this step.
      // `gulp-sourcemaps`, which comes next, will externalize them.
      format:'umd',
      sourceMap: 'inline',
      moduleName: config.mainVarName
    });
    $.file(exportFileName + '.js', res.code, { src: true })
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.babel())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .pipe($.filter(['*', '!**/*.js.map']))
      .pipe($.rename(exportFileName + '.min.js'))
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .on('end', done);
  })
  .catch(done);
});
//Build bundle version
gulp.task('build:bundle', function (callback) {
  runSequence('addExternals', callback);
});

// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build', function (callback) {
  runSequence('lint-src', 'lint-test', 'test', 'build:main', 'build:bundle', 'watch', callback);
});

//Browserify with external modules included
gulp.task('addExternals', function() {
  return bundle(browserifyAndWatchBundler());
});

//Run test once using Karma and generate code coverage then exit
gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Release a new version of the package
gulp.task('release', function(callback) {
  const tagCreate = 'git tag -a v' + manifest.version + ' -m ' + 'Version v' + manifest.version;
  const tagPush = 'git push --tags';
  //Bump package version
  //Unlink local modules
  //Build (test/build:main/build:bundle)
  //Upload to CDN locations
  //Create a git tag and push the tag
  //TODO: Look into what should be moved to happening after travis build
  //TODO: Include 'npm publish', 'git commit' and 'git push'?
  runSequence('bump', 'unlink', 'build', 'upload',  shell.task([tagCreate, tagPush]), callback);
});

// Basic usage:
// Will patch the version
gulp.task('bump', function(){
  gulp.src('./component.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

//Watch files and trigger a rebuild on change
gulp.task('watch', function() {
  const watchCollection = mainFiles.concat(watchFiles).concat(ignoreFiles);
  // console.log('watching collection:', watchCollection);
  gulp.watch(watchCollection, ['build']);
});

//Upload to both locations of CDN
gulp.task('upload', function (callback) {
  runSequence('upload:version', 'upload:latest', callback);
});

//Upload to CDN under version
gulp.task('upload:version', function() {
  return gulp.src('./' + conf.folders.dist + '/**')
    .pipe($.rename(function (path) {
      path.dirname = conf.cdn.path + '/' + manifest.version + '/' + path.dirname;
    }))
    .pipe(publisher.publish())
    .pipe(awspublish.reporter());
});
//Upload to CDN under "/latest"
gulp.task('upload:latest', function() {
  return gulp.src('./' + conf.folders.dist + '/**')
    .pipe($.rename(function (path) {
      path.dirname = conf.cdn.path + '/latest/' + path.dirname;
    }))
    .pipe(publisher.publish())
    .pipe(awspublish.reporter());
});
//Upload to CDN under "/latest"
gulp.task('upload:docs', function() {
  return gulp.src('./' + conf.folders.dist + '/**')
    .pipe($.rename(function (path) {
      path.dirname = conf.cdn.path + '/latest/' + path.dirname + '/docs';
    }))
    .pipe(publisher.publish())
    .pipe(awspublish.reporter());
});
// Generate docs based on comments
gulp.task('docs', function() {
  gulp.src('./' + conf.folders.dev)
  .pipe(esdoc({ destination: './' + conf.folders.docs }));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    port: conf.Port || 4000,
    server: {
      baseDir: "./"
    }
  });
});
// Static server
gulp.task('browser-sync:docs', function() {
  browserSync.init({
    port: conf.docsPort || 5000,
    server: {
      baseDir: "./docs/"
    }
  });
});
// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
  del(['tmp'], cb);
});

// Lint our source code
createLintTask('lint-src', ['src/**/*.js']);

// Lint our test code
createLintTask('lint-test', ['test/**/*.js', '!test/coverage/**']);

//Link list of modules
gulp.task('link', shell.task(buildLinkCommands('link')));

//Unlink list of modules
gulp.task('unlink', shell.task(buildLinkCommands('unlink')));

// An alias of test
gulp.task('default', ['coverage', 'build']);

//----------------------- Utility Functions -------------------------------\\
function buildLinkCommands(linkAction){
  //TODO: Don't allow package types that don't follow standard link/unlink pattern
  // const allowedPackageLinkTypes = ['bower', 'npm'];
  if(!linkAction){
    linkAction = 'link';
  }
  const linkTypes = _.keys(conf.linkedModules);
  const messageCommand = 'echo ' + linkAction + 'ing local modules';
  var commands = [messageCommand];
  //Each type of packages to link
  _.each(linkTypes, function (packageType){
    //Check that package link patter is supported
    // if(!_.contains(allowedPackageLinkTypes, packageType)){
    //   console.error('Invalid package link packageType');
    //   return;
    // }
    //Each package of that packageType
    _.each(conf.linkedModules[packageType], function (packageName){
      commands.push(packageType + ' ' + linkAction  + ' ' + packageName);
      if(linkAction === 'unlink'){
        commands.push(packageType + ' install ' + packageName);
      }
    });
  });
  return commands;
}
function CDNPublisher () {
  var s3Config = {
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    params:{
      Bucket:conf.cdn.bucketName
    }
  };
  return awspublish.create(s3Config);
}

function bundle(bundler) {
  return bundler.bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe($.plumber())
    .pipe(source('./tmp/__matter.bundle.js'))
    .pipe(buffer())
    .pipe($.rename(exportFileName + '.bundle.js'))
    .pipe(gulp.dest(destinationFolder))
    .pipe($.livereload());
}
function browserifyAndWatchBundler(code) {
  // Create our bundler, passing in the arguments required for watchify
  var bundler = browserify('src/' + exportFileName + '.js', {standalone:config.mainVarName});

  // Watch the bundler, and re-bundle it whenever files change
  // bundler = watchify(bundler);
  // bundler.on('update', function() {
  //   bundle(bundler);
  // });

  // // Set up Babelify so that ES6 works in the tests
  bundler.transform(babelify.configure({
    ignore: /(bower_components)|(node_modules)/,
    sourceMapRelative: __dirname + '/src',
    optional: ["es7.asyncFunctions"],
    stage:2
  }));
  return bundler;
};
// Send a notification when JSCS fails,
// so that you know your changes didn't build
function jscsNotify(file) {
  if (!file.jscs) { return; }
  return file.jscs.success ? false : 'JSCS failed';
}

function createLintTask(taskName, files) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe($.plumber())
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError())
      .pipe($.jscs())
      .pipe($.notify(jscsNotify));
  });
}
