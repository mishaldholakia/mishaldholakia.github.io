(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=[{
        "origin": [-122.414, 37.776],
        "id": "tmp1",
        "destination": [-77.032, 38.913],
        "color": "#da1e28",
        "status": "inactive"
    },
    {
        "origin": [-122.4821473, 47.6129432],
        "id": "tmp2",
        "destination": [-73.7803278, 40.6413111],
        "color": "#0f62fe",
        "status": "active"
    },
    {
        "origin": [-84.4205731, 33.6402546],
        "id": "tmp3",
        "destination": [-77.032, 38.913],
        "color": "#da1e28",
        "status": "inactive"
    },
    {
        "origin": [-80.1527909, 26.0742344],
        "id": "tmp4",
        "destination": [-84.4205731, 33.6402546],
        "color": "#0f62fe",
        "status": "active"
    },
    {
        "origin": [-122.392041, 37.6148706],
        "id": "tmp5",
        "destination": [-84.4205731, 33.6402546],
        "color": "#da1e28",
        "status": "inactive"
    },
    {
        "origin": [-122.4821473, 47.6129432],
        "id": "tmp6",
        "destination": [-73.7803278, 40.6413111],
        "color": "#0f62fe",
        "status": "active"
    },
    {
        "origin": [-122.414, 37.776],
        "id": "tmp7",
        "destination": [-77.032, 38.913],
        "color": "#da1e28",
        "status": "inactive"
    },
    {
        "origin": [-122.4821473, 47.6129432],
        "id": "tmp8",
        "destination": [-73.7803278, 40.6413111],
        "color": "#0f62fe",
        "status": "active"
    }
]
},{}],2:[function(require,module,exports){
const array = require('../data/data.json')
mapboxgl.accessToken = 'pk.eyJ1IjoibWlzaGFsZGhvbGFraWEiLCJhIjoiY2pqeXFmaTFpMWNmYTNwbzYzbjF1dDZuMSJ9.nXDFbTcdJPSc4U9Wqv1few';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-96, 37.8],
    zoom: 3,
    minZoom: 1
});

array.forEach(element => {
    let origin = element.origin;
    let destination = element.destination
    let id = element.id;
    let color = element.color;
    let status = element.status;

    // A simple line from origin to destination.
    var route = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [origin, destination]
            }
        }]
    };

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

    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');

    var arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 1200;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        var segment = turf.along(route.features[0], i, 'kilometers');
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    // var counter = 0;

    map.on('load', function() {
        // Add a source and layer displaying a point which will be animated in a circle.
        map.addSource(`${id} + ${status}`, {
            'type': 'geojson',
            'data': route
        });

        map.addSource(`${id} + point`, {
            'type': 'geojson',
            'data': point
        });

        map.addLayer({
            'id': `${id} + ${status}`,
            'source': `${id} + ${status}`,
            'type': 'line',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'line-width': 1,
                'line-color': color || '#' + (Math.random().toString(16) + "000000").substring(2, 8)
            }
            //'line-color': '#' + (Math.random().toString(16) + "000000").substring(2, 8)
        });
        map.addLayer({
            'id': `${id} + point`,
            'source': `${id} + point`,
            'type': 'symbol',
            'layout': {
                'icon-image': 'airport-15',
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });
    })
})

document.getElementById('bx--checkbox-active').addEventListener('click', function() {
    let status = document.getElementById('bx--checkbox-active');
    if (status.checked) {
        array.forEach(element => {
            if (element.status === 'active') {
                map.setLayoutProperty(`${element.id} + ${element.status}`, 'visibility', 'visible');
                map.setLayoutProperty(`${element.id} + point`, 'visibility', 'visible');
            }
        })
    } else {
        array.forEach(element => {
            if (element.status === 'active') {
                map.setLayoutProperty(`${element.id} + ${element.status}`, 'visibility', 'none');
                map.setLayoutProperty(`${element.id} + point`, 'visibility', 'none');
            }
        })
    }
});
document.getElementById('bx--checkbox-inactive').addEventListener('click', function() {
    let status = document.getElementById('bx--checkbox-inactive');
    if (status.checked) {
        array.forEach(element => {
            if (element.status === 'inactive') {
                map.setLayoutProperty(`${element.id} + ${element.status}`, 'visibility', 'visible');
                map.setLayoutProperty(`${element.id} + point`, 'visibility', 'visible');
            }
        })
    } else {
        array.forEach(element => {
            if (element.status === 'inactive') {
                map.setLayoutProperty(`${element.id} + ${element.status}`, 'visibility', 'none');
                map.setLayoutProperty(`${element.id} + point`, 'visibility', 'none');
            }
        })
    }
});
},{"../data/data.json":1}]},{},[2]);
