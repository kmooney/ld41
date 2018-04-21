window.Entities = {
    Player: function(kartScene) {
        var self = this;
        var highlight = new THREE.MeshBasicMaterial({color: "#f0f000"})
        this.position = new THREE.Vector3(0,0,0);
        this.axisAngle = new THREE.Vector3(0,0,1);
        this.direction = Math.PI * 3 ;
        this.velocity = 0.09;
        this.kart = kartScene;

        this.update = function(dt) {
            self.kart.position.z += this.velocity * Math.cos(this.direction);
            self.kart.position.x += this.velocity * Math.sin(this.direction);
            self.kart.rotation.z = this.direction;

            if (self.velocity >= 0)
                self.velocity -= 0.01;

        }
    }
}

window.Instances = {
    
};