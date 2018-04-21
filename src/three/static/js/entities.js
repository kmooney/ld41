// entities.js
var Player = function() {
    var self = this;
    this.position = THREE.Vector3(0,0,0);
    this.velocity = 0.0;
    this.direction = Math.PI;
}

window.WORLD = {
    player: new Player(),
    update: function (dt) {
        console.log(dt);
        player = WORLD.player;

    }
}
