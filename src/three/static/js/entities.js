var UP = new THREE.Vector3(0,1,0);
window.Entities = {
    Player: function(kart) {
        var self = this;
        var highlight = new THREE.MeshBasicMaterial({color: "#f0f000"})
        var friction = new THREE.Vector3(0,0,1);
        var turnAngle = 0.07;

        var velocity = new THREE.Vector3(0,0,0);
        self.velocity = velocity;
        var direction = 0;
        
        
        this.kart = kart;
        this.obj3D = new THREE.Object3D();
        this.obj3D.add(this.kart);
        
        var gas = false, brake = false, left = false, right = false;

        this.update = function(dt, dungeon) {            
            if(left && velocity.length() > 0.01){
                direction += turnAngle;
                velocity.applyAxisAngle(UP, turnAngle);
            }
            if(right && velocity.length() > 0.01){
                direction -= turnAngle;
                velocity.applyAxisAngle(UP, -turnAngle);                
            }
            if(gas) {
                var t = new THREE.Vector3(0,0,0.01);
                t.applyAxisAngle(UP, direction);   
                velocity.add(t);
            }
            if(brake) {
                velocity.multiplyScalar(0.1);
            }

            velocity.multiplyScalar(0.95);

            velocity.clampLength(0,0.1);
            
            dungeon.applyBounds(self);

            this.obj3D.position.add(velocity);
            kart.rotation.z = direction;
            
        }
        
        this.addToScene = function(scene){
            scene.add(this.obj3D);
        }

        window.addEventListener('keydown', function(e) {
        
            if (e.keyCode == 38) {
                gas = true;
            }
            if (e.keyCode == 40) {
                brake = true;
            }
            if (e.keyCode == 37) {
                left = true;
            }
            if (e.keyCode == 39) {
                right = true;
            }
        });
    
        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 38) {
                gas = false;
            }
            if (e.keyCode == 40) {
                brake = false;
            }
            if (e.keyCode == 37) {
                left = false;
            }
            if (e.keyCode == 39) {
                right = false;
            }
        });
    }
}

window.Instances = {
    
};
