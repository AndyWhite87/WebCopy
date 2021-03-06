module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    filename: '<%= pkg.name %>.<%= pkg.version %>',

    timestamp: new Date().toUTCString(),

    banner: '/*! <%= filename %>.js | <%= pkg.url %> | <%= pkg.license %>\n' +
            '*   <%= pkg.author %> | <%= pkg.contact %>\n' +
            '*   Built on <%= timestamp %> */\n',

    s: 'src/',
    t: 'test/',

    concat: {
      options: {
        banner: '<%= banner %>' +
                '\n;(function() {\n\n"use strict";\n\n',
        footer: '\n})();\n'
      },
      dist: {
        src: ['<%=s%>lib/cuts-the-mustard.js', '<%=s%>_mustard-cut.js', '<%=s%>lib/*.js',
              '<%= s %>_jsdoc.js', '<%=s%>main.js', '<%=s%>footer.js'],
        dest: 'dist/<%= filename %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= filename %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jasmine: {
      src: ['<%=s%>lib/*.js', '<%=s%>main.js', '<%=s%>footer.js'],
      options: {
        specs: '<%=t%>/*.js',
        template: require('grunt-template-jasmine-istanbul'),
        templateOptions: {
          coverage: 'coverage/coverage.json',
          report: [
            { type: 'lcov', options: { dir: 'coverage' }},
            { type: 'html', options: { dir: 'coverage/html' }},
            { type: 'text-summary' }
          ],
          thresholds: {
            lines: 40, // 75
            statements: 40, // 75
            branches: 35, // 75
            functions: 50 // 75
          }
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', '<%=s%>**/*.js', '<%=t%>**/*.js'],
      options: {
        browser: true,
        globals: {
          predef: ['jQuery']
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine']
    },

    coveralls: {
      options: {
        force: true
      },
      src: 'coverage/lcov.info'
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');

  grunt.registerTask('test', ['jshint', 'jasmine', 'coveralls']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'concat', 'uglify']);

};