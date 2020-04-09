import {hello} from 'leaflet-providers';
import Util from './Util';
import Api from '../api/index';
const L = require('leaflet')
const axios = require('axios').default;


/**
 * Map app
 */
export default {
    map: null,
    geojson: null,
    data: null,
    timeLine: null,
    countries: null,
    markers: [],
    options: {
        zoomSnap: 0,
        maxZoom: 16,
    },

    async init() {
        let ApiRequest = new Api();

        await ApiRequest.setEndpoint('/argentina/info').getData()
            .then((response) => {
                this.data = response.data;
                this.data.states = Object.values(this.data.states);
            });

        // Set up map and await..
        await this.setUpMap();

        // Get Time Line
        ApiRequest.setEndpoint('/argentina/daily').getData()
            .then((response) => {
                this.timeLine = response.data;
                this.setRangeControls();
            });

        // Get Countries
        await ApiRequest.setEndpoint('/countries/info').getData()
            .then((response) => {
                this.countries = response.data;
                this.addCountriesMarkers();
            });


        Util.populateWoldList(this.countries, this.map);
        Util.populateProvinceList(this.data.states);
    },

    // Set up map to be
    setUpMap: function() {
        this.map = L.map('map_container', this.options)
        this.setStyle();
        this.map.setView(this.centerMap(), this.getZoom())
        this.loadProvinces();
        this.addMarkers();
        this.populateFrontEnd();
    },

    // Control range slider to select day
    setRangeControls: function () {
        Util.rangeSlider(this.timeLine);
    },

    // Centers Init map
    centerMap: function() {
        if (window.innerWidth < 992) {
            return new L.LatLng(-38,-64);
        }
        return new L.LatLng(-40,-78);
    },

    
    // Set default initial zoom, enable decimals
    getZoom: function() {
        if (window.innerWidth < 992) {
            return 4;
        }
        return 4.7;
    },

    // Set map textures from contributors
    setStyle: function () {
        this.map.addLayer(this.createOSM());
        L.tileLayer.provider('Esri.WorldImagery').addTo(this.map);
    },

    // Set map contributors
    createOSM: function () {
        return new L.tileLayer('http://{s}tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 12,
            subdomains: ['a.', 'b.', 'c.', '']
        });
    },

    // populate external map frontend
    populateFrontEnd: function () {
        // populate data
        Util.animateValue("total-cases", 0, this.data.total_cases, 2500);
        Util.animateValue("total-recovered", 0, this.data.total_recovered, 2500);
        Util.animateValue("total-death", 0, this.data.total_death, 2500);
        let updatedAt = document.getElementById('updated-at');
        updatedAt.innerHTML = this.data.updated_at;

        Util.populateCards(this.data);
    },

    // Add markers for Argentina Only
    addMarkers: function () {
        this.data.states.forEach((province) => {
            if (province.cases) {
                let icon = this.buildIconArgentina(province)
                let iconObject =  L.divIcon({
                    className: "leaflet-data-marker",
                    html: L.Util.template(icon.mapIconUrl, icon), //.replace('#','%23'),
                    iconAnchor  : [12, 32],
                    iconSize    : [25, 30],
                    popupAnchor : [0, -28]
                })
                // add marker
                let marker = L.marker([province.province.lat, province.province.lng], {
                    title: province.province.name,
                    icon: iconObject
                }).addTo(this.map);

                let popup = '';
                popup += `<div>
                    <h4>${province.province.name}</h4>
                    <div class="cases">Casos registrados: ${province.cases}</div>
                    <div class="cases">Fallecidos: ${province.death}</div>`;
                if (province.recovered > 0) {
                    popup += `<div class="cases">Recuperados: ${province.recovered}</div>`;
                }
                popup += '</div>';

                // add pop up
                marker.on('mouseover', (e) => {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popup)
                        .openOn(this.map);
                });
                marker.on('click', (e) => {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popup)
                        .openOn(this.map);
                });
                this.markers.push(marker);
            }
        })
    },

    // Add markers for rest of the world
    addCountriesMarkers: function () {
        this.countries.forEach((country) => {
            if (country && country.lat && country.lng) {
                let icon = this.buildIconCountry(country)
                let iconObject = L.divIcon({
                    className: "leaflet-data-marker",
                    html: L.Util.template(icon.mapIconUrl, icon), //.replace('#','%23'),
                    iconAnchor  : [12, 32],
                    iconSize    : [25, 30],
                    popupAnchor : [0, -28]
                })
                // add marker
                let marker = L.marker([country.lat, country.lng], {
                    title: `${country.name} (${country.code})`,
                    icon: iconObject
                }).addTo(this.map);

                let popup = '';

                popup += `<div><h4>${country.name} (${country.code})</h4>`;

                if (country.population > 0) {
                    popup += `<div class="cases">Población: ${country.population}</div>`;
                }
                if (country.confirmed > 0) {
                    popup += `<div class="cases">Casos registrados: ${country.confirmed}</div>`;
                }
                if (country.deaths > 0) {
                    popup += `<div class="cases">Fallecidos: ${country.deaths}</div>`;
                }
                if (country.recovered > 0) {
                    popup += `<div class="cases">Recuperados: ${country.recovered}</div>`;
                }
                if (country.today_confirmed > 0) {
                    popup += `<div class="cases">Confirmados Hoy: ${country.recovered}</div>`;
                }
                if (country.today_deaths > 0) {
                    popup += `<div class="cases">Fallecidos Hoy: ${country.recovered}</div>`;
                }
                if (country.critical > 0) {
                    popup += `<div class="cases">Estado critico: ${country.critical}</div>`;
                }
                if (country.recovery_rate > 0) {
                    popup += `<div class="cases">Tasa de recuperación: ${country.recovery_rate}%</div>`;
                }
                if (country.cases_per_million_population) {
                    popup += `<div class="cases">Casos / millón Hab.: ${country.cases_per_million_population}</div>`;
                }
                if (country.last_update) {
                    let options = { month: 'short', day: 'numeric' };
                    let format = new Date(country.last_update)
                    let date = format.toLocaleDateString('es-ES', options);
                    popup += `<br><div class="cases">Actualización: ${date}</div>`;
                }

                popup += '</div>';

                // add pop up
                marker.on('mouseover', (e) => {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popup)
                        .openOn(this.map);
                });
                marker.on('click', (e) => {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popup)
                        .openOn(this.map);
                });

                this.markers.push(marker);
            }
        })
    },

    // Build icon for Countries in the world
    buildIconCountry: function (country) {
        return this.buildIcon(country.confirmed, country.code, 'country-marker');
    },

    // Build icon for Argentina
    buildIconArgentina: function (province) {
        return this.buildIcon(province.cases, province.province.slug, 'province-marker');
    },

    // Get generic Icon Marker SVG
    buildIcon: function (comfirmed, id, classes ) {
        let confirmed = parseInt(comfirmed);
        let ratio = '';
        if (confirmed > 0) { ratio = 30; }
        if (confirmed > 10) { ratio = 40; }
        if (confirmed > 100) { ratio = 50; }
        if (confirmed > 100) { ratio = 60; }
        if (confirmed > 1000) { ratio = 70; }
        if (confirmed > 10000) { ratio = 80; }
        if (confirmed > 100000) { ratio = 90; }
        if (confirmed > 1000000) { ratio = 100; }
        let position = ratio/2;
        return {
            mapIconUrl: `<svg width="${ratio}" height="${ratio}" id="${id}" class="${classes}">
                  <circle cx="${position}" cy="${position}" r="${position}" />
                  <text x="50%" y="52%" text-anchor="middle" fill="white" font-size="18px" font-family="Poppins" dy=".3em">
                      ${confirmed}
                  </text>
                  Sorry, your browser does not support inline SVG.
            </svg>`
        }
    },

    // Load Argentina provinces
    loadProvinces: function () {
        let _this = this;
        let geoJsonData = require('../data/provincias.json'); //(with path)
        geoJsonData = geoJsonData.features;
        _this.geojson = L.geoJson(geoJsonData, {
            style: this.getStyle
        }).addTo(_this.map);
    },

    // Get Style of provinces polygons
    getStyle: function (feature) {
        return {
            fillColor: '#0072bb',
            fillOpacity: 0.4,
            color: 'white',
            weight: 1,
            opacity: 0.6,
            dashArray: '3'
        };
    },


    // highlightFeature: function (e) {
    //     var layer = e.target.feature ? e.target : $(this).data('layer');
    //
    //     layer.setStyle({
    //         weight: 1,
    //         color: '#000000',
    //         dashArray: '',
    //         fillOpacity: 0.7
    //     });
    //     if (!L.Browser.ie && !L.Browser.opera) {
    //         layer.bringToFront();
    //     }
    // },

    // resetHighlight: function (e) {
    //     var layer = e.target.feature ? e.target : $(this).data('layer');
    //     //var layer = e.target;
    //     this.geojson.resetStyle(layer);
    // },
    //
    // zoomToFeature: function (e) {
    //     var layer = e.target.feature ? e.target : $(this).data('layer');
    //     this.map.fitBounds(layer.getBounds());
    // },


    // loadDepartamentos: function (feature) {
    //     let _this = this;
    //     let geoJsonData = require(`./data/provincias${ feature.properties.provincia.toUpperCase() }.json`);
    //     L.geoJson(geoJsonData).addTo(_this.map);
    // },

    // setMenuLink: function (name, layer) {
    //     $.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'layer', layer);
    // }
};








