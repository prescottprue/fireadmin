module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify','es6-shim','mocha', 'chai'],
    files: [
      'src/**/*.js',
      'test/**/*.spec.js',
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.js': 'browserify',
      'test/**/*.js': 'browserify'
    },
    browserify : {
      transform : ['babelify']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
