const json = require('../data/restricted-travel-map/data.json')
mapboxgl.accessToken = 'pk.eyJ1IjoibWlzaGFsZGhvbGFraWEiLCJhIjoiY2pqeXFmaTFpMWNmYTNwbzYzbjF1dDZuMSJ9.nXDFbTcdJPSc4U9Wqv1few';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-96, 37.8],
    zoom: 1,
    minZoom: 1
})
map.on('load', function() {
    // Add a source for the state polygons.
    map.addSource('countries', {
        'type': 'geojson',
        'data': 'https://datahub.io/core/geo-countries/r/countries.geojson'
    });

    // Add a layer showing the state polygons.
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': 'countries',
        'paint': {
            'fill-color': '#0f6dff',
            'fill-opacity': 0.5
        }
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('mouseenter', 'states-layer', function(e) {
        json.forEach(element => {
            if (e.features[0].properties.ISO_A3 === element.ISO_A3) {
                let description = `<h4>${e.features[0].properties.ADMIN}</h4><br><ul><li>isInboundRestricted:${element.isInboundRestricted}</li><li>isInboundLandRestricted:${element.isInboundLandRestricted}</li><li>isInboundCompletelyRestricted:${element.isInboundCompletelyRestricted}</li><li>inboundRestrictedCountryNamesRaw:${element.inboundRestrictedCountryNamesRaw}</li>`;
                popup
                    .setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(map);
            }
        });
        // popup
        //     .setLngLat(e.lngLat)
        //     .setHTML(e.features[0].properties.ADMIN)
        //     .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'states-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'states-layer', function() {
        popup.remove();
        map.getCanvas().style.cursor = '';
    });
});