import {hello} from 'leaflet-providers';
var L = require('leaflet')
const axios = require('axios').default;

export default {
    map: null,
    geojson: null,
    data: null,
    markers: [],
    options: {
        zoomSnap: 0
    },

    init: function () {
        this.loadData();
        this.map = L.map('map_container', this.options)
        this.setStyle();
        this.map.setView(this.centerMap(), this.getZoom())
        this.loadAllProvincias();
        this.addMarkers();
    },

    centerMap: function() {
        if (window.innerWidth < 992) {
            return new L.LatLng(-40,-65);
        }
        return new L.LatLng(-40,-78);
    },


    getZoom: function() {
        if (window.innerWidth < 992) {
            return 4.2;
        }
        return 4.7;
    },

    loadData: function() {

        // axios here
        this.data = {
            provinces: [
                {
                    'slug': 'capital-federal',
                    'cases': 23,
                    'active': 2,
                    'recovered': 1,
                    'death': 0,
                    'title': 'Capital Federal',
                    'center': [-34.614718, -58.4527925],
                },
                {
                    'slug': 'tierra-del-fuego',
                    'cases': 65,
                    'active': 2,
                    'recovered': 1,
                    'death': 0,
                    'title': 'Tierra del Fuego',
                    'center': [-53.7796186,-68.9949533],
                },
                {
                    'slug': 'jujuy',
                    'cases': 12,
                    'active': 2,
                    'recovered': 1,
                    'death': 0,
                    'title': 'Jujuy',
                    'center': [-22.9547407,-66.0151787],
                },,
                {
                    'slug': 'cordoba',
                    'cases': 0,
                    'active': 0,
                    'recovered': 0,
                    'death': 0,
                    'title': 'Cordoba',
                    'center': [-22.9547407,-66.0151787],
                },
            ]
        }

        // update frontend.
        this.data.provinces.forEach(province => {
            let ul = document.getElementById("provinces");
            let el = document.createElement('li');
            let title = province.cases ? `${province.title} -` : province.title;
            let string = [];
            if (province.active) {
                string.push(`${province.active} Activos`)
            }
            if (province.recovered) {
                string.push(`${province.recovered} Recuperados`)
            }
            if (province.death) {
                string.push(`${province.death} Fallecidos`)
            }
            el.innerHTML = `<a href="#">${title} 
                <span>${string.join(', ')}</span></a>`;
            ul.appendChild(el);
        })

    },

    setStyle: function () {
        this.map.addLayer(this.createOSM());
        L.tileLayer.provider('Esri.WorldImagery').addTo(this.map);
    },


    createOSM: function () {
        return new L.tileLayer('http://{s}tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 12,
            subdomains: ['a.', 'b.', 'c.', '']
        });
    },


    addMarkers: function () {

        this.data.provinces.forEach((province) => {
            if (province.cases) {
                let marker = L.marker(province.center, {
                    title: province.title,
                    icon: this.getMarker(province.cases)
                }).addTo(this.map);
                this.markers.push(marker);
            }
        })


    },

    getMarker: function (numberOfCases) {
        return L.divIcon({
            className: "leaflet-data-marker",
            html: L.Util.template(this.buildIcon(numberOfCases).mapIconUrl, this.buildIcon(numberOfCases)), //.replace('#','%23'),
            iconAnchor  : [12, 32],
            iconSize    : [25, 30],
            popupAnchor : [0, -28]
        })
    },


    buildIcon: function (numberOfCases) {
        return {
            mapIconUrl: `<svg width="50" height="50">
                  <circle cx="25" cy="25" r="25" fill="#aeaeae" />
                  <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20px" font-family="Arial" dy=".3em">
                      ${numberOfCases}
                  </text>
                  Sorry, your browser does not support inline SVG.
            </svg>`
        };
    },


    loadAllProvincias: function () {
        let _this = this;
        let geoJsonData = require('./data/provincias.json'); //(with path)
        geoJsonData = geoJsonData.features;
        _this.geojson = L.geoJson(geoJsonData, {
            //onEachFeature: this.loadProvincia,
            style: this.getStyle
        }).addTo(_this.map);
    },


    loadProvincia: function (feature, layer) {
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.zoomToFeature
        });
        //this.setMenuLink(feature.properties.provincia, layer);
    },

    getColor: function (id) {
        switch (id % 5) {
            case 0:
                return '#0072bb';
            case 1:
                return '#0060a0';
            case 2:
                return '#004b88';
            case 3:
                return '#002851';
            case 4:
                return '#00111b';
        }
    },

    getStyle: function (feature) {
        console.log('LOG', this);
        return {
            fillColor: '#0072bb',//this.getColor(feature.properties.objectid),
            fillOpacity: 0.7,
            color: 'white',
            weight: 1,
            opacity: 0.8,
            dashArray: '3'
        };
    },

    highlightFeature: function (e) {
        var layer = e.target.feature ? e.target : $(this).data('layer');

        layer.setStyle({
            weight: 1,
            color: '#000000',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    },

    resetHighlight: function (e) {
        var layer = e.target.feature ? e.target : $(this).data('layer');
        //var layer = e.target;
        this.geojson.resetStyle(layer);
    },

    zoomToFeature: function (e) {
        var layer = e.target.feature ? e.target : $(this).data('layer');
        this.map.fitBounds(layer.getBounds());
        // this.loadDepartamentos(layer.feature)
    },


    loadDepartamentos: function (feature) {
        let _this = this;
        let geoJsonData = require(`./data/provincias${ feature.properties.provincia.toUpperCase() }.json`);
        L.geoJson(geoJsonData).addTo(_this.map);
    },

    setMenuLink: function (name, layer) {
        $.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'layer', layer);
    }
};








