## Getting Started

OpenSeadragon has no external dependencies. To install, [download](../#download) and copy the `openseadragon` folder into your web root or static files directory, add it to your page, and create a viewer with [new OpenSeadragon.Viewer(options)](OpenSeadragon.Viewer.html#Viewer) or `OpenSeadragon(options)` for short.

Here is an example of basic usage:

    <div id="openseadragon1" style="width: 800px; height: 600px;"></div>
    <script src="/openseadragon/openseadragon.min.js"></script>
    <script type="text/javascript">
        var viewer = OpenSeadragon({
            id: "openseadragon1",
            prefixUrl: "/openseadragon/images/",
            tileSources: "/path/to/my/image.dzi"
        });
    </script>

OpenSeadragon will also return an AMD or CommonJs module when required with a loader like [Require.js](http://requirejs.org/), [Webpack](https://webpack.github.io/) or [Browserify](http://browserify.org/).

You will, of course, need zooming image data to work with. See [Creating Zooming Images](/examples/creating-zooming-images/).

For more information on the options object you pass in to `OpenSeadragon()`, see [OpenSeadragon.Options](OpenSeadragon.html#.Options). To learn more about the viewer that it creates, see [OpenSeadragon.Viewer](OpenSeadragon.Viewer.html). For programmatic control of zoom and pan, see [OpenSeadragon.Viewport](OpenSeadragon.Viewport.html).

For other advanced topics, see our [Examples & Features](../#examples-and-features) pages.


If you are working directly from the file system (accessing your web page from `file:///path/to/your/file.htm`) you may need to change your browser's local files security policy so that your zooming image data can be loaded. Alternatively, you can run a local server. You can find help on both methods in [three.js documentation](https://threejs.org/docs/#manual/introduction/How-to-run-things-locally).

### Important note for Angular users

By default Angular enables change detection in all imported code, which introduces a lot of CPU load in UI intensive libraries. To avoid this, you must create `Openseadragon` object out of [NgZone](https://angular.io/guide/zone). Instead of

    const viewer = OpenSeadragon(options);

use

    const viewer = this.ngZone.runOutsideAngular(() =>
      OpenSeadragon(options)
    );

More info in the [Angular documentation](https://angular.io/guide/zone#ngzone-run-and-runoutsideofangular).
