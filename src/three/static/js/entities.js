window.Entities = {
    Player: function(kartScene) {
        var self = this;
        var highlight = new THREE.MeshBasicMaterial({color: "#f0f000"})
        this.position = new THREE.Vector3(0,0,0);
        this.axisAngle = new THREE.Vector3(0,0,1);
        this.direction = -Math.PI / 2 ;
        this.velocity = 0.01;
        this.kart = kartScene;

        this.update = function(dt) {
            self.kart.position.z += this.velocity * Math.cos(this.direction);
            self.kart.position.x += this.velocity * Math.sin(this.direction);
            self.kart.rotation.z = this.direction;
        }
    }
}

window.Instances = {

};
