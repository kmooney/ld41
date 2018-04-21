window.Entities = {
    Player: function(kartScene) {
        var self = this;
        this.position = THREE.Vector3(0,0,0);
        this.velocity = 0.0;
        this.direction = 0;
        this.kartScene = kartScene;

        this.update = function(dt) {
            kartScene.position = this.position;
            kartScene.rotation.z = this.direction;
        }
    }
}

window.Instances = {

};