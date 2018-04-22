(function() {
    var hud = document.getElementById('hud');
    
    function showTitle() {
        var e = document.createElement('img');
        e.src="static/img/title.png";
        hud.appendChild(e);
    }

    function showMessages() {
        var v = document.createElement('div');
        v.id="message";
        v.innerHTML = "Use arrow keys to control Kart.<br>Press any key to race."
        hud.appendChild(v)
    }

    function hideMessages() {
        document.getElementById('message').remove();
    }

    showTitle();
    showMessages();

    window.addEventListener('keypress', function(e) {
        GAME.gameMode();
        hideMessages();

    });


})()