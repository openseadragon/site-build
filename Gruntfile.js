module.exports = function(grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // ----------
    var buildRoot = "build/";
    var releaseRoot = "../openseadragon.github.com/";

    var filesToCopy = [
        "openseadragon.tar",
        "openseadragon.zip"
    ];

    var foldersToCopy = [
        "css",
        "images",
        "openseadragon"
    ];

    var examples = {
        "tilesource-custom": "Custom Tile Source",
        "tilesource-dzi": "DZI Tile Source",
        "tilesource-osm": "Open Street Maps Tile Source",
        "tilesource-tms": "Tiled Map Service Tile Source",
        "tilesource-iiif": "IIIF Tile Source",
        "tilesource-legacy": "Legacy Tile Sources",
        "tilesource-zoomit": "Zoom.it Tile Sources",
        "tilesource-sequence": "Tile Source Sequence",
        "tilesource-collection": "Tile Source Collections",
        "ui-binding-custom-buttons": "Binding Custom Buttons",
        "ui-reference-strip": "Image Reference Strip",
        "ui-toolbar": "Toolbar",
        "ui-viewport-navigator": "Viewport Navigator",
        "ui-zoom-and-pan": "Viewport Zoom and Pan",
        "ui-overlays": "Overlays",
        "developer-debug-mode": "Developer Tools - Debug Mode"
    };

    // ----------
    function getVersion() {
        var data = grunt.file.read("openseadragon/openseadragon.js");
        var matches = data.match(/@version\s*OpenSeadragon\s*(.*)\s*/);
        if (matches && matches.length == 2) {
            return matches[1];
        }

        grunt.fail.fatal("Unable to locate version number in openseadragon/openseadragon.js");
        return "";
    }

    // ----------
    // Project configuration.
    grunt.initConfig({
        clean: {
            www: {
                src: [
                    buildRoot + "*",
                    "!" + buildRoot + "example-images",
                    "!" + buildRoot + "docs"
                ]
            },
            doc: {
                src: [
                    buildRoot + "docs/"
                ]
            },
            release: {
                src: [
                    releaseRoot + "*",
                    "!" + releaseRoot + "README.md",
                    "!" + releaseRoot + "node_modules",
                    "!" + releaseRoot + "Gruntfile.js",
                    "!" + releaseRoot + "package.json",
                    "!" + releaseRoot + "example-images"
                ],
                options: {
                    force: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: buildRoot
                }
            }
        },
        watch: {
            files: [ "Gruntfile.js", "www/*", "openseadragon/*", "css/*" ],
            tasks: ["build"]
        }
    });

    // ----------
    // Make:www task.
    // Builds all of the HTML pages.
    grunt.registerTask("make:www", function() {
        var base = grunt.file.read("www/base.html");
        var version = getVersion();

        var make = function(src, dest, title) {
            var content = grunt.file.read(src);
            var built = grunt.template.process(base, {
                data: {
                    title: title,
                    version: version,
                    content: content
                }
            });

            grunt.file.write(dest, built);
        };

        for (var key in examples) {
            make("www/" + key + ".html", 
                buildRoot + "examples/" + key + "/index.html",
                examples[key] + " | ");
        }

        make("www/index.html", buildRoot + "index.html", "");
    });

    // ----------
    // Make:doc task.
    // Generates the documentation.
    grunt.registerTask("make:doc", function() {
        var done = this.async();
        grunt.util.spawn({
            cmd: "ant",
            args: ["doc"]
        }, function(error, result) {
            if (error) {
                grunt.log.error(error);
                return done(false);
            }

            done(result);
        });
    });

    // ----------
    // Copy:build task.
    // Copies needed files to the build folder.
    grunt.registerTask("copy:build", function() {
        filesToCopy.forEach(function(v, i) {
            grunt.file.copy(v, buildRoot + v);
        });

        foldersToCopy.forEach(function(v, i) {
            grunt.file.recurse(v, function(abspath, rootdir, subdir, filename) {
                var dest = buildRoot 
                    + v
                    + "/"
                    + (subdir ? subdir + "/" : "")
                    + filename;

                grunt.file.copy(abspath, dest);
            });
        });
    });

    // ----------
    // Copy:release task.
    // Copies needed files to the release folder.
    grunt.registerTask("copy:release", function() {
        grunt.file.recurse(buildRoot, function(abspath, rootdir, subdir, filename) {
            var dest = releaseRoot
                + (subdir ? subdir + "/" : '/')
                + filename;

            grunt.file.copy(abspath, dest);
        });
    });

    // ----------
    // Build task.
    // Cleans the built files out of the build folder and builds new ones, except the docs, which take some time.
    grunt.registerTask("build", ["clean:www", "make:www", "copy:build"]);

    // ----------
    // Doc task.
    // Cleans the doc files out of the build folder and builds new ones.
    grunt.registerTask("doc", ["clean:doc", "make:doc"]);

    // ----------
    // Publish task.
    // Cleans the built files out of ../openseadragon.github.com, builds, and copies newly built ones over.
    grunt.registerTask("publish", ["build", "doc", "clean:release", "copy:release"]);

    // ----------
    // Default task.
    // Cleans the built files out of ../openseadragon.github.com, builds, and copies newly built ones over.
    grunt.registerTask("default", ["build"]);
};
