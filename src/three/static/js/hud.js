HUD = new (function() {
    var hud = document.getElementById('hud');
    var time = 0;
    var timeEl = null;
    var timeShown = false;
    var minimap_template = null;

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
        showMinimap();
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

    function showMinimap(){
        minimap_template = _.template(document.getElementById("minimap_template").innerText);
        var mapEl = document.createElement('div');
        mapEl.id = "minimap";
        hud.appendChild(mapEl);
        document.addEventListener('room-change',function(e){
            var grid = e.dungeon.room_hud();
            console.log("updating minimap",grid);
            mapEl.innerHTML = minimap_template({grid:grid,curx:e.dungeon.current.x,cury:e.dungeon.cury});
            //console.log("Minimap Template",grid,minimap_template({grid:grid}));
        });
    }

    function update(dt) {}




    this.update = update;
})()
