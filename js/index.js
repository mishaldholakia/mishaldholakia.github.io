const array = require('../data/data.json')
    // console.log(array);
mapboxgl.accessToken = 'pk.eyJ1IjoibWlzaGFsZGhvbGFraWEiLCJhIjoiY2pqeXFmaTFpMWNmYTNwbzYzbjF1dDZuMSJ9.nXDFbTcdJPSc4U9Wqv1few';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-96, 37.8],
    zoom: 3,
    minZoom: 0
});

// // San Francisco
// var origin = [-122.414, 37.776];

// // Washington DC
// var destination = [-77.032, 38.913];
map.on('load', function() {
    array.forEach(element => {
        let origin = [element.lng, element.lat];
        let id = element.ident;

        // A single point that animates along the route.
        // Coordinates are initially set to origin.
        var point = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': origin
                }
            }]
        };
        map.addSource(`${id}`, {
            'type': 'geojson',
            'data': point
        });
        map.addLayer({
                'id': `${id}`,
                'source': `${id}`,
                'type': 'circle',
                'paint': {
                    // make circles larger as the user zooms from z12 to z22
                    'circle-radius': {
                        'base': 20,
                        'stops': [
                            [12, 2],
                            [22, 180]
                        ]
                    },
                    "circle-stroke-width": 3,
                    "circle-stroke-color": '#3bb2d0',
                    "circle-color": '#3bb2d0'
                }
            })
            // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', `${id}`, function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // let description = element.text;

            let description = `<b>${element.ident}</b> <br><p>${element.text}</p>`;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            // while (Math.abs(element.lng - element.lat) > 180) {
            //     origin[0] += element.lng > element.lat ? 360 : -360;
            // }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
                .setLngLat(origin)
                .setHTML(element.ident)
                .setHTML(description)
                .addTo(map);
        });

        map.on('mouseleave', `${id}`, function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    })
});