$(document).ready(() => {
    var goToMap = $('#goToMap');
    var goHome = $('#goHome');

    goToMap.click( () => {
        window.location.href = '/map.html';
    })

    goHome.click( () => {
        window.location.href = '/index.html';
    })

    setTimeout(() => {
        $('#redir').show();
    }, 1000)
})
