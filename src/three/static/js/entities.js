var UP = new THREE.Vector3(0,1,0);

window.Entities = {
    Player: function(kartScene) {
        var self = this;
        var highlight = new THREE.MeshBasicMaterial({color: "#f0f000"})
        this.position = new THREE.Vector3(0,0,0);
        this.axisAngle = new THREE.Vector3(0,0,1);
        this.direction = -Math.PI / 2 ;
        this.velocity = new THREE.Vector3(0.05,0,0);
        this.friction = new THREE.Vector3(0,0,0);
        this.kart = kartScene;

        this.update = function(dt,dungeon) {
            var v = this.velocity;
            var engine = new THREE.Vector3(0,0,0); // if engine is on
            v.add(engine.applyAxisAngle(UP,this.direction));
            v.add(this.friction.applyAxisAngle(UP,this.direction));

            self.kart.position.z += v.z;
            self.kart.position.x += v.x;
            self.kart.rotation.z = this.direction;

            dungeon.applyBounds(self);
        }
    }
}

window.Instances = {
    
};
