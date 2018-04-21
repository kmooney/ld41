window.Entities = {
    Player: function(kartScene) {
        var self = this;
        this.position = new THREE.Vector3(0,0,0);
        this.axisAngle = new THREE.Vector3(0,0,1);
        this.direction = Math.PI / 10 ;
        this.velocity = .02;
        this.kart = kartScene;

        this.update = function(dt) {
            self.kart.rotation.z = this.direction;
            self.kart.position.z += this.velocity * Math.cos(this.direction);
            self.kart.position.x += this.velocity * Math.sin(this.direction);
            self.direction += 0.01;
        }
    }
}

window.Instances = {

};