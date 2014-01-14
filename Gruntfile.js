module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            all: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.scss'],
                    dest: 'css/',
                    rename: function(dest, src) {
                        return dest + src.replace('scss', 'css');
                    }
                }]
            }
        },

        csscomb: {
            all: {
                options: {
                    config: 'css/csscomb-config.json'
                },
                files: {
                    'css/ravenous.css': ['css/ravenous.css']
                }
            },
            sass: {
                options: {
                    config: 'css/csscomb-config.json'
                },
                files: {
                    'css/ravenous.scss': ['css/ravenous.scss']
                }
            }
        },

        cssmin: {
            all: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },

        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/'
                }]
            }
        },

        svgmin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['*.svg', '!*.min.svg'],
                    dest: 'images/',
                    ext: '.min.svg'
                }]
            }
        },

        watch: {
            all: {
                files: ['css/*.scss', '_posts/*.md', 'images/*'],
                tasks: ['newer:sass', 'newer:csscomb', 'newer:cssmin', 'newer:imagemin', 'newer:svgmin']
            },
            sass: {
                files: ['css/*.scss'],
                tasks: ['sass', 'csscomb', 'cssmin']
            }
        },

    });

    // Load Plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-newer');

    // Register Tasks
    grunt.registerTask('default', ['sass', 'csscomb', 'cssmin']);

};