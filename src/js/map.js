import {hello} from 'leaflet-providers';
import helpers from './helpers';
var L = require('leaflet')
const axios = require('axios').default;

export default {
    map: null,
    geojson: null,
    data: null,
    markers: [],
    options: {
        zoomSnap: 0,
        maxZoom: 16,
    },

    init: function () {
        // axios here
        axios.get('https://api.covid19argentina.com/api/info')
            .then((response) => {
                this.data = response.data;
                // update frontend.
                this.data.states = Object.values(this.data.states)
                this.data.states.forEach(item => {
                    let ul = document.getElementById("provinces");
                    let el = document.createElement('li');
                    let name = item.cases ? `${item.province.name} -` : item.province.name;
                    let string = [];
                    if (item.active) {
                        string.push(`${item.active} Activos`)
                    }
                    if (item.recovered) {
                        string.push(`${item.recovered} Recuperados`)
                    }
                    if (item.death) {
                        string.push(`${item.death} Fallecidos`)
                    }
                    el.innerHTML = `<a href="#">${name}
                    <span>${string.join(', ')}</span></a>`;
                    ul.appendChild(el);
                })

                this.setUpMap();
            })
            .catch((error) => {
                console.log(error);
            })
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

    setUpMap: function() {
        this.map = L.map('map_container', this.options)
        this.setStyle();
        this.map.setView(this.centerMap(), this.getZoom())
        this.loadAllProvincias();
        this.addMarkers();
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

        helpers.animateValue("total-cases", 0, this.data.total_cases, 2500);
        let updatedAt = document.getElementById('updated-at');
        updatedAt.innerHTML = this.data.updated_at;

        this.data.states.forEach((province) => {
            if (province.cases) {
                // add marker
                let marker = L.marker([province.province.lat, province.province.lng], {
                    title: province.province.name,
                    icon: this.getMarker(province.cases)
                }).addTo(this.map);

                let popup = `<div>
                    <h4>${province.province.name}</h4>
                    <div class="cases">Casos registrados: ${province.cases}</div>
                    <div class="cases">Recuperados: ${province.recovered}</div>
                    <div class="cases">Fallecidos: ${province.death}</div>
                </div>`;

                // add pop up
                marker.on('mouseover', (e) => {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popup)
                        .openOn(this.map);
                });

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
                  <circle cx="25" cy="25" r="25" fill="#2561a9" />
                  <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="18px" font-family="Poppins" dy=".3em">
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


    // loadProvincia: function (feature, layer) {
    //     layer.on({
    //         mouseover: this.highlightFeature,
    //         mouseout: this.resetHighlight,
    //         click: this.zoomToFeature
    //     });
    //     //this.setMenuLink(feature.properties.provincia, layer);
    // },

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
        return {
            fillColor: '#0072bb',//this.getColor(feature.properties.objectid),
            fillOpacity: 0.4,
            color: 'white',
            weight: 1,
            opacity: 0.6,
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


    // loadDepartamentos: function (feature) {
    //     let _this = this;
    //     let geoJsonData = require(`./data/provincias${ feature.properties.provincia.toUpperCase() }.json`);
    //     L.geoJson(geoJsonData).addTo(_this.map);
    // },

    setMenuLink: function (name, layer) {
        $.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'layer', layer);
    }
};








