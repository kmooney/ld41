var UP = new THREE.Vector3(0,1,0);

window.Entities = {
    Player: function(kartScene) {
        var self = this;
        var highlight = new THREE.MeshBasicMaterial({color: "#f0f000"})
        this.position = new THREE.Vector3(0,0,0);
        this.axisAngle = new THREE.Vector3(0,0,1);
        this.direction = 0;
        this.engine = new THREE.Vector3(0,0,0.03);
        this.velocity = new THREE.Vector3(0,0,0);
        this.friction = new THREE.Vector3(0,0,0);
        this.kart = kartScene;
        this.obj3D = new THREE.Object3D();
        this.obj3D.add(this.kart);
        this.gas = false;

        this.update = function(dt,dungeon) {
            self.direction += 0.01;
            var v = new THREE.Vector3(0,0,0);
            // add current velocity
            v.add(this.velocity);
            v.multiplyScalar(0.8);

            // add engine power
            var thrust = new THREE.Vector3(0,0,0);
            if( v.length() < 0.03 && this.gas ){
                thrust.add(self.engine);
                thrust.applyAxisAngle(UP,this.direction);
                v.add(thrust);
            }

            self.obj3D.position.add(v);
            self.kart.rotation.z = this.direction;

            this.velocity = v;
            dungeon.applyBounds(self);
        }
        
        this.addToScene = function(scene){
            scene.add(this.obj3D);
        }
    }
}

window.Instances = {
    
};
