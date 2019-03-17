var hide = $('#hideBtn');
var layout = $('#components')
var hide_status = 0;

hide.click(() => {
    if (hide_status == 0) {
        layout.removeClass('ShowAnimation');
        layout.addClass('HideAnimation');
        hide_status = 1;
        map.setZoom(10)
    }else {
        layout.removeClass('HideAnimation');
        layout.addClass('ShowAnimation');
        hide_status = 0;
        map.setZoom(10)
    }
})
