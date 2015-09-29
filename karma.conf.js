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
      'src/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify']
    },
    coverageReporter: {
      reporters: [
        { type: 'html' }
      ]
    },
    browserify : {
      debug: true,
      transform: ['babelify',['browserify-istanbul', {instrumenter: require('isparta')}]]
    },
    reporters: ['progress', 'dots', 'coverage'],
    port: 9876,
    colors: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
