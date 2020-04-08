/**
 * Created by Ezequiel on 26/03/2020.
 */
import $ from 'jquery';
import Map from './modules/Map';

window.jQuery = $;
window.$ = $;

$(document).ready(function () {

    Map.init();

    /**
     * Menu controls Jquery
     */
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


    $('.controls .item').click(function (e) {
        let setActive = $(this).attr('id');
        $('.controls .item').removeClass('active');
        $(this).addClass('active');
        let current = $('.sidebar-inner .content.active');
        current.removeClass('active');
        $('.sidebar-inner').find('.content.'+setActive).addClass('active');

    });


    $(document).on('click', '.statics .arrow', function (e) {
        e.preventDefault();
        $(this).parent().toggleClass('closed')
    });


});