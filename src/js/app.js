/**
 * Created by Ezequiel on 26/03/2020.
 */
import $ from 'jquery';
import app from './map';

window.jQuery = $;
window.$ = $;

$(document).ready(function () {

    app.init();

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