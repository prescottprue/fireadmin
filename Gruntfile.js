module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        env: grunt.file.readJSON('env.json'),
        connect: {
          dev: {
            options: {
              port: '<%= config.Port %>',
              //keepalive: true, keeping grunt running
              livereload:true,
              base: '<%= config.devFolder %>/',
              open: {
                target: 'http://localhost:<%= config.Port %>',
                appName: 'Google Chrome',
              }
            }
          },
          stage:{
            options: {
              port: '<%= config.Port %>',
              //keepalive: true, keeping grunt running
              livereload:true,
              base: '<%= config.distFolder %>/',
              open: {
                target: 'http://localhost:<%= config.Port %>',
                appName: 'Google Chrome',
              }
            }
          },
          docs:{
            options: {
              port: '<%= config.docsPort %>',
              livereload:true,
              base: '<%= config.distFolder %>/docs/',
              open: {
                target: 'http://localhost:<%= config.docsPort %>',
                appName: 'Google Chrome',
              }
            }
          }
        },
        watch: {
          js: {
            files: ['<%= config.devFolder %>/fireadmin.js'],
            tasks:['jsdoc'],
            options:{
              livereload:{
                port:35739
              },
            }
          },
          html: {
            files: ['<%= config.devFolder %>/index.html'],
            tasks:[],
            options:{
              livereload:{
                port:35739
              },
            }
          }
        },
        concat: {
          bundle: {
            // options: { banner: '<%= meta.banner %>' },
            src: [
              '<%= config.distFolder %>/lib/firebase/firebase.js',
              '<%= config.distFolder %>/fireadmin.js'
            ],
            dest: '<%= config.distFolder %>/fireadmin-bundle.js'
          }
        },
        aws_s3:{
          production:{
            options: {
              accessKeyId: '<%= env.AWSAccessKeyId %>',
              secretAccessKey: '<%= env.AWSSecretKey %>',
              bucket:'<%= env.Bucket %>',
              uploadConcurrency: 30
            },
            files:[
              {'action': 'upload', expand: true, cwd: '<%= config.distFolder %>', src: ['**'], dest: '<%= env.BucketFolder %>/<%= pkg.version %>', differential:true},
              {'action': 'upload', expand: true, cwd: '<%= config.distFolder %>', src: ['**'], dest: '<%= env.BucketFolder %>/current', differential:true}
            ]
          },
          stage:{
            options: {
              accessKeyId: '<%= env.AWSAccessKeyId %>',
              secretAccessKey: '<%= env.AWSSecretKey %>',
              bucket:'<%= env.Bucket %>',
              uploadConcurrency: 30
            },
            files:[
              {'action': 'upload', expand: true, cwd: '<%= config.distFolder %>', src: ['**'], dest: '<%= env.BucketFolder %>/staging', differential:true}
            ]
          }
        },
        jsdoc: {
          dev:{
            src: ['<%= config.devFolder %>/fireadmin.js'],
            options: {
              destination: '<%= config.distFolder %>/docs',
              template:'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
              configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
            }
          }
        },
        bump:{
          options:{
            files:['package.json','bower.json'],
            updateConfigs:['pkg'],
            commit:true,
            commitMessage:'[RELEASE] Release v%VERSION%',
            commitFiles:['-a'],
            createTag:true,
            tagName:'v%VERSION%',
            push:true,
            pushTo:'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
            globalReplace: false
          }
        },
        shell:{
          compile:{
            command:'java -jar <%= env.CLOSURE_PATH %>/build/compiler.jar ' +
            '--js_output_file=dist/fireadmin.js <%= config.devFolder %>/fireadmin.js  --define="DEBUG=false" '+
            '--only_closure_dependencies --closure_entry_point=Fireadmin <%= config.devFolder %>/closure-library/** ' +
            '--warning_level=VERBOSE --compilation_level=SIMPLE_OPTIMIZATIONS'
            // ' --angular_pass --externs <%= env.CLOSURE_PATH %>/externs/angular.js --generate_exports '+ //Angular
            // '--externs <%= config.devFolder %>/fa/session.js'
          },
          compileDebug:{
            command:'java -jar <%= env.CLOSURE_PATH %>/build/compiler.jar ' +
            '--js_output_file=dist/fireadmin-debug.js <%= config.devFolder %>/fireadmin.js  --define="DEBUG=false" '+
            '--only_closure_dependencies --closure_entry_point=Fireadmin <%= config.devFolder %>/closure-library/** ' +
            '--warning_level=VERBOSE --compilation_level=WHITESPACE_ONLY '
            // ' --angular_pass --externs <%= env.CLOSURE_PATH %>/externs/angular.js --generate_exports '+ //Angular
            // '--externs <%= config.devFolder %>/fa/session.js'
          },
          // compileBundle:{
          //   command:'java -jar <%= env.CLOSURE_PATH %>/build/compiler.jar ' +
          //   '--js_output_file=dist/fireadmin-bundle.js <%= config.devFolder %>/fireadmin.js  --define="DEBUG=false" '+
          //   '--only_closure_dependencies --closure_entry_point=Fireadmin <%= config.devFolder %>/closure-library/** ' +
          //   '--warning_level=VERBOSE --compilation_level=SIMPLE_OPTIMIZATIONS --js_externs=dev/lib/firebase/firebase.js'
          //   // ' --angular_pass --externs <%= env.CLOSURE_PATH %>/externs/angular.js --generate_exports '+ //Angular
          //   // '--externs <%= config.devFolder %>/fa/session.js'
          // },
          builder:{
            command:'python <%= config.devFolder %>/closure-library/closure/bin/build/closurebuilder.py --root="../../fireadmin fireadmin" --output_file="fireadmin-deps.js"'
          },
          deps:{
            command:'python <%= config.devFolder %>/closure-library/closure/bin/build/depswriter.py --root_with_prefix="../../fireadmin fireadmin" --output_file="fireadmin-deps.js"'
          }
        }

    });

    // Default task(s).
    grunt.registerTask('default', [ 'connect:dev', 'watch']);
    //Documentation, minify js, minify html
    // grunt.registerTask('build', ['jsdoc', 'closure-compiler']);
    grunt.registerTask('build', ['jsdoc','shell:compile', 'shell:compileDebug', 'concat']);

    grunt.registerTask('docs', ['jsdoc', 'connect:docs']);

    grunt.registerTask('test', ['build', 'connect:stage', 'watch']);

    grunt.registerTask('stage', ['build', 'aws_s3:stage']);

    grunt.registerTask('version', ['stage','bump-only','aws_s3:stage']);
    grunt.registerTask('release', ['bump-commit', 'aws_s3:production']);

    grunt.registerTask('releaseVersion', ['stage','bump-only', 'bump-commit', 'aws_s3:production']);

};
