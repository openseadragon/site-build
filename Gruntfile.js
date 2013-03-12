module.exports = function(grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    var destRoot = "../openseadragon.github.com/";

    // ----------
    // Project configuration.
    grunt.initConfig({
        clean: {
            src: [
                destRoot + "*",
                "!" + destRoot + "README.md",
                "!" + destRoot + "node_modules",
                "!" + destRoot + "Gruntfile.js",
                "!" + destRoot + "package.json",
                "!" + destRoot + "example-images"
            ],
            options: {
                force: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: destRoot
                }
            }
        },
        watch: {
            files: [ "grunt.js", "src/*.js" ],
            tasks: "build"
        }
    });

    // ----------
    // Build task.
    // Builds all of the HTML pages and puts them in the destination folder.
    grunt.registerTask("build", function() {
        var base = grunt.file.read("www/base.html");

        var build = function(src, dest, title) {
            var content = grunt.file.read(src);
            var built = grunt.template.process(base, {
                data: {
                    title: title,
                    version: 123,
                    content: content
                }
            });

            grunt.file.write(dest, built);
        };

        var map = {
            'tilesource-custom': 'Custom Tile Source',
            'tilesource-dzi': 'DZI Tile Source',
            'tilesource-osm': 'Open Street Maps Tile Source',
            'tilesource-tms': 'Tiled Map Service Tile Source',
            'tilesource-iiif': 'IIIF Tile Source',
            'tilesource-legacy': 'Legacy Tile Sources',
            'tilesource-zoomit': 'Zoom.it Tile Sources',
            'tilesource-sequence': 'Tile Source Sequence',
            'tilesource-collection': 'Tile Source Collections',
            'ui-binding-custom-buttons': 'Binding Custom Buttons',
            'ui-reference-strip': 'Image Reference Strip',
            'ui-toolbar': 'Toolbar',
            'ui-viewport-navigator': 'Viewport Navigator',
            'ui-zoom-and-pan': 'Viewport Zoom and Pan',
            'ui-overlays': 'Overlays',
            'developer-debug-mode': 'Developer Tools - Debug Mode'
        };

        for (var key in map) {
            build("www/" + key + ".html", 
                destRoot + "examples/" + key + "/index.html",
                map[key] + " | ");
        }

        build("www/index.html", destRoot + "index.html", "");
    });

    // ----------
    // Copy task.
    // Copies needed files to the destination folder.
    grunt.registerTask("copy", function() {
        var sources = ["openseadragon", "images", "css"];
        sources.forEach(function(v, i) {
            grunt.file.recurse(v, function(abspath, rootdir, subdir, filename) {
                var dest = destRoot 
                    + v
                    + "/"
                    + (subdir ? subdir + "/" : "")
                    + filename;

                grunt.file.copy(abspath, dest);
            });
        });

        grunt.file.copy("openseadragon.tar", destRoot + "openseadragon.tar");
        grunt.file.copy("openseadragon.zip", destRoot + "openseadragon.zip");
    });

    // ----------
    // Publish task.
    // Cleans the built files out of ../site-build and copies newly built ones over.
    grunt.registerTask("publish", ["clean", "build", "copy"]);
};
