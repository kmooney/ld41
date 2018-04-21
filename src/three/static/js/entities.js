window.Entities = {
    Player: function(kartScene) {
        var self = this;
        this.position = THREE.Vector3(0,0,0);
        this.velocity = 0.0;
        this.direction = Math.PI;
        this.kartScene = kartScene;

        this.update = function(dt) {
            kartScene.position = this.position;
            kartScene.rotation = this.direction;
        }
    }
}

window.Instances = {

};