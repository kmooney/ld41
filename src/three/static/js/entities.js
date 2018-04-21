var UP = new THREE.Vector3(0,1,0);
window.Entities = {
    Player: function(kart) {
        var self = this,
            highlight = new THREE.MeshBasicMaterial({color: "#f0f000"}),
            friction = new THREE.Vector3(0,0,1),
            turnAngle = 0.07,
            velocity = new THREE.Vector3(0,0,0),
            direction = 0,
            collideRadius = 0.25;
            gas = false, brake = false,
            left = false, right = false;
        
        this.velocity = velocity;
        this.kart = kart;
        this.obj3D = new THREE.Object3D();
        this.kart.position.z = 0;
        this.obj3D.add(this.kart);

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

    
            var fwd_velocity = velocity.clone().applyAxisAngle(UP,direction).z; 
            // not working..
            if(brake) {
                if( fwd_velocity > 0){
                    velocity.multiplyScalar(0.1);
                }else{
                    var b = new THREE.Vector3(0,0,-0.01);   
                    b.applyAxisAngle(UP, direction);
                    velocity.add(b); 
                }
            }

            velocity.multiplyScalar(0.95);

            velocity.clampLength(0,0.1);
            
            dungeon.applyBounds(self,collideRadius);

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

        // DEBUG COLLIDE
        this.add_debug_ring = function(){ 
            var radius   = collideRadius,
                segments = 32,
                material = new THREE.LineBasicMaterial( { color: 0xff00ff } ),
                geometry = new THREE.CircleGeometry( radius, segments );

                // Remove center vertex
                geometry.vertices.shift();
            var ring = new THREE.Line( geometry, material ) 
            ring.rotation.x = Math.PI/2;
            this.obj3D.add( ring ); 
        }
        this.add_debug_ring();


    }
}

window.Instances = {
    
};
