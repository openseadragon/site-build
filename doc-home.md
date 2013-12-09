## Getting Started

 OpenSeadragon has no external dependencies. To install, [download](../#download) and copy the `openseadragon` folder into your web root or static files directory, add it to your page, and create a viewer with the [OpenSeadragon()](module-OpenSeadragon.html) function.

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

For more information on the options object you pass in to `OpenSeadragon()`, see [OpenSeadragon.Options](OpenSeadragon.html#Options). To learn more about the viewer that it creates, see [OpenSeadragon.Viewer](OpenSeadragon.Viewer.html). For programmatic control of zoom and pan, see [OpenSeadragon.Viewport](OpenSeadragon.Viewport.html).

For other advanced topics, see our [Examples & Features](../#examples-and-features) pages.
