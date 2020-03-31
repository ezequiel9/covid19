/**
 * Created by Ezequiel on 26/03/2020.
 */
import $ from 'jquery';
import helpers from './helpers';
import app from './map';

window.jQuery = $;
window.$ = $;
// const API_URL = 'https://local.coronavirus.api/api';
const API_URL = 'https://api.covid19argentina.com/api';

$(document).ready(function () {

    app.init(API_URL);

    $('#menu li a')
        .mouseover( app.highlightFeature)
        .mouseout( app.resetHighlight )
        .click( app.zoomToFeature );

    $('.menu-opener').click(function (e) {
        e.preventDefault()
        $('#sidebar').toggleClass('open');
    });
    $('.menu-closer').click(function (e) {
        e.preventDefault()
        $('#sidebar').toggleClass('open');
    });
    $('.more-info').click(function (e) {
        e.preventDefault()
        $('.more-info').toggleClass('open');
        $('header').toggleClass('open');
    });
});