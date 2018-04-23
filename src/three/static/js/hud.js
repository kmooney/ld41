HUD = new (function() {
    var hud = document.getElementById('hud');
    var time = 0;
    var timeEl = null;
    var timeShown = false;
    function showTitle() {
        var e = document.createElement('img');
        e.src="static/img/title.png";
        hud.appendChild(e);
    }

    function showMessages() {
        var v = document.createElement('div');
        v.id="message";
        v.innerHTML = "Use arrow keys to control Kart.<br>Use ‘Space’ to brake.<br>Press any key to race."
        hud.appendChild(v)
    }

    function hideMessages() {
        document.getElementById('message').remove();
    }

    var l = function(e) {
        GAME.gameMode();
        hideMessages();
        showHealth();
        showTime();
        window.removeEventListener('keypress', l);
    }

    window.addEventListener('keypress', l);

    showTitle();
    showMessages();

    function showTime() {
        timeEl = document.createElement('div');
        timeEl.id = "time";
        hud.appendChild(timeEl);
        timeShown = true;
        window.setInterval(function() {
            time += 99;
            minutes = Math.floor(time / 60000);
            seconds = Math.floor((time % 60000) / 1000);
            millis = time % 6000 % 1000;
            timeEl.innerText = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + ":" + millis;
        }, 99);
    }

    function showHealth() {
        var health = document.createElement('div');
        health.id = "health";
        hud.appendChild(health);
    }

    function update(dt) {}




    this.update = update;
})()