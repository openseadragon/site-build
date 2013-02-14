== OpenSeadragon Site-Build

This project compiles static web pages which provide the examples and documentation
for using OpenSeadragon.

== On the Web

[ Current url: http://openseadragon.github.com/ ]

== Building the Web pages

Building from source is easy with 'ant'.  The result is output to a folder
specified in the build.properties files, WWW.  By default we assume it is
a folder in the same parent folder as this project named 'openseadragon/github.com'.

If you need to specify a different directly, please create and edit a file named
local.properties and this can override the values provided by default in build.properties.

> ant 

== Building the API Documentation pages

Also built with ant, the result runs jsdoc over overseadragon.js and produces
the html documentation pages.

> ant doc