HUD = new (function() {
    var hud = document.getElementById('hud');
    this.time = 0;
    var self = this;
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

    var startGame = function(e) {
        GAME.gameMode();
        hideMessages();
        showHealth();
        showTime();
        showMinimap();
        document.addEventListener("greenkey",function(e){
            if( self.time < 1000 * 60 * 60){
                alert("You Won!");
                window.location.reload();
            } else {
                alert("Too Late! Try to find it in under a minute!");
                window.location.reload();
            }   
            
        });

        window.removeEventListener('keypress', startGame);
    }

    window.addEventListener('keypress', startGame);

    showTitle();
    showMessages();

    function showTime() {
        timeEl = document.createElement('div');
        timeEl.id = "time";
        hud.appendChild(timeEl);
        timeShown = true;
        window.setInterval(function() {
            self.time += 99;
            minutes = Math.floor(self.time / 60000);
            seconds = Math.floor((self.time % 60000) / 1000);
            millis = self.time % 6000 % 1000;
            timeEl.innerText = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + millis;
        }, 99);
    }

    function showHealth() {
        var health = document.createElement('div');
        health.id = "health";
        hud.appendChild(health);
    }

  
    function updateMiniMap(dungeon,mapEl) {
            var grid_context = dungeon.room_hud();
            var mapEl = document.getElementById("minimap"); 
            mapEl.innerHTML = minimap_template(grid_context);
            console.log(grid_context.grid);
    }
 
    function showMinimap() {
        minimap_template = _.template(document.getElementById("minimap_template").innerText);
        var mapEl = document.createElement('div');
        mapEl.id = "minimap";
        hud.appendChild(mapEl);
        document.addEventListener('room-change',function(e){
            updateMiniMap(e.dungeon);
        });
        updateMiniMap(Instances.dungeon);
    }

    function update(dt) {}



    this.update = update;
})()
