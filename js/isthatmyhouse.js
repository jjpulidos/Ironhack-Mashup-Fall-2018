$(document).ready( () => {
    $('#features').click(function(){
        $('html, body').animate({
            scrollTop: $("#features_scrolled").offset().top
        }, 500, 'swing');
    });

    $("#info").click(function() {
        $('html, body').animate({
            scrollTop: $("#info_scrolled").offset().top
        }, 500, 'swing');
    });


    $("#pageName").click(function() {
        $('html, body').animate({
            scrollTop: $("#page-top").offset().top
        }, 500, 'swing');
    });

    $("#getStarted").click(function() {
        $('html, body').animate({
            scrollTop: $("#info_scrolled").offset().top
        }, 500, 'swing');
    });

    $("#tech").click(function() {
        $('html, body').animate({
            scrollTop: $("#technologies").offset().top
        }, 500, 'swing');
    });
})
