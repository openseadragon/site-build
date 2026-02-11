module.exports = function (grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-jsdoc');

    // ----------
    var buildRoot = "build/";
    var releaseRoot = "../openseadragon.github.com/";
    var builtSourceUnMinified = "built-openseadragon/openseadragon/openseadragon.js";

    var foldersToCopy = {
        css: "css",
        images: "images",
        releases: "releases",
        "built-openseadragon": ""
    };

    var examples = {
        "tilesource-custom": "Custom Tile Source",
        "tilesource-custom-advanced": "Building custom TileSource in Depth",
        "tilesource-dzi": "DZI Tile Source",
        "tilesource-osm": "OpenStreetMap Tile Source",
        "tilesource-tms": "Tiled Map Service Tile Source",
        "tilesource-iiif": "IIIF Tile Source",
        "tilesource-legacy": "Legacy Tile Source",
        "tilesource-zoomify": "Zoomify Tile Source",
        "tilesource-zoomit": "Zoom.it Tile Source",
        "tilesource-image": "Image Tile Source",
        "tilesource-sequence": "Sequence Mode",
        "tilesource-collection": "Collection Mode",
        "ui-binding-custom-buttons": "Binding Custom Buttons",
        "ui-reference-strip": "Image Reference Strip",
        "ui-toolbar": "Toolbar",
        "ui-viewport-navigator": "Viewport Navigator",
        "ui-zoom-and-pan": "Viewport Zoom and Pan",
        "ui-overlays": "Overlays",
        "ui-rotation": "Rotation",
        "ui-keyboard-navigation": "Keyboard Navigation",
        "ui-customize-tooltips": "Customize Tooltips",
        "ui-tiledimage-polygon-cropping": "Crop TiledImage with Polygons",
        "developer-debug-mode": "Developer Tools - Debug Mode",
        "creating-zooming-images": "Creating Zooming Images",
        "viewport-coordinates": "Viewport Coordinates",
        "in-the-wild": "OpenSeadragon in the Wild",
        "multi-image": "Multi-Image",
        "migration-v5": "Migration notes from v1-v4 to v5",
        "migration-v6": "Migration notes from v5 to v6",
        "data-types": "Data Types in OpenSeadragon",
        "data-modifications": "Data Modification Pipeline",
        "drawer-design": "Designing Drawers (Advanced)",
    };

    // ----------
    function getVersion() {
        var data = grunt.file.read(builtSourceUnMinified);
        var matches = data.match(/@version\s*openseadragon\s*(.*)\s*/);
        if (matches && matches.length == 2) {
            return matches[1];
        }

        grunt.fail.fatal("Unable to locate version number in " + builtSourceUnMinified);
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
                    "!" + buildRoot + "openseadragonizer",
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
                    "!" + releaseRoot + "CONTRIBUTING.md",
                    "!" + releaseRoot + "node_modules",
                    "!" + releaseRoot + "Gruntfile.js",
                    "!" + releaseRoot + "package.json",
                    "!" + releaseRoot + "example-images",
                    "!" + releaseRoot + "openseadragonizer"
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
            files: ["Gruntfile.js", "www/*", "css/*", "built-openseadragon/**"],
            tasks: ["build"]
        },
        jsdoc: {
            src: [builtSourceUnMinified, 'doc-home.md'],
            options: {
                destination: buildRoot + 'docs',
                configure: 'doc-conf.json',
                private: false
            }
        }
    });

    // ----------
    // Make:www task.
    // Builds all of the HTML pages.
    grunt.registerTask("make:www", function () {
        try {
            var base = grunt.file.read("www/base.html");
            var version = getVersion();

            var shortVersion = version.split('.');
            shortVersion.pop();
            shortVersion = shortVersion.join('.');

            var make = function (src, dest, title) {
                var content = grunt.file.read(src);
                var built = grunt.template.process(base, {
                    data: {
                        title: title,
                        version: version,
                        shortVersion: shortVersion,
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
            make("www/license.html", buildRoot + "license/index.html", "License | ");
            // meta-refresh redirect; doesn't use base template
            grunt.file.copy("www/releases.html", buildRoot + "releases/index.html");
        } catch (e) {
            // get the stacktrace
            console.error(e);
            throw e;
        }
    });

    // ----------
    // Copy:build task.
    // Copies needed files to the build folder.
    grunt.registerTask("copy:build", function () {
        var copyOne = function (from, to) {
            grunt.file.recurse(from, function (abspath, rootdir, subdir, filename) {
                var dest = buildRoot
                    + to
                    + "/"
                    + (subdir ? subdir + "/" : "")
                    + filename;

                grunt.file.copy(abspath, dest);
            });
        };

        for (var key in foldersToCopy) {
            copyOne(key, foldersToCopy[key]);
        }
    });

    // ----------
    // Copy:release task.
    // Copies needed files to the release folder.
    grunt.registerTask("copy:release", function () {
        grunt.file.recurse(buildRoot, function (abspath, rootdir, subdir, filename) {
            if (subdir && /^(example-images|openseadragonizer)/.test(subdir)) {
                return;
            }

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
    grunt.registerTask("doc", ["clean:doc", "jsdoc"]);

    // ----------
    // Publish task.
    // Cleans the built files out of ../openseadragon.github.com, builds, and copies newly built ones over.
    grunt.registerTask("publish", ["build", "doc", "clean:release", "copy:release"]);

    // ----------
    // Dev task.
    // Builds, fires up a server and watches for changes.
    grunt.registerTask("dev", ["build", "connect", "watch"]);

    // ----------
    // Default task.
    // Cleans the built files out of ../openseadragon.github.com, builds, and copies newly built ones over.
    grunt.registerTask("default", ["build"]);
};
