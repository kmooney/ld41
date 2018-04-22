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
            health = 100,
            boost = {t:0,amount:1.0}, slide = {t:0, amount:0.0},
            gas = false, brake = false,
            left = false, right = false, reverse = false;

        
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
            if(reverse) {
                var b = new THREE.Vector3(0,0,-0.005);
                b.applyAxisAngle(UP, direction);
                velocity.add(b);
            }

            if(brake) {
                velocity.multiplyScalar(0.5);
            }

            velocity.multiplyScalar(0.95 + slide.amount);

            velocity.clampLength(0,0.1);
   
            if(boost.t > 0){
                velocity.multiplyScalar(boost.amount);
            }
            
            dungeon.applyBounds(self,collideRadius,true);
            collided = dungeon.collide(self, collideRadius);
            this.obj3D.position.add(velocity);
            kart.rotation.z = direction;
           
            if(boost.t > 0){
                console.log("boost active",boost,dt);
                boost.t += dt;
            }else{ boost.amount = 1.0; } //reset boost
            if(slide.t > 0){
                console.log("slide active",slide,dt);
                slide.t += dt;
            }else{ slide.amount = 0.0; } //reset slide
        }

        this.applyDamage = function(amount){
            this.health -= 10;
            if(this.health <= 0){
                alert("You Died");
                // TODO reset game?
            } 
        }        

        this.applyBoost = function(amount,time){
            boost.amount = amount; // e.g. 2 for double speed
            boost.t = time;  // e.g. 500 for 1/2 second
        }

        this.applySlide = function(amount,time){
            slide.amount = amount; // e.g. -0.3 for banana peel
            slide.t = time; // e.g. 500 for 1/2 second
        }

        this.addToScene = function(scene){
            scene.add(this.obj3D);
        }

        window.addEventListener('keydown', function(e) {
            if (e.keyCode == 38) {
                gas = true;
            }
            if (e.keyCode == 40) {
                reverse = true;
            }
            if (e.keyCode == 32) {
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
                reverse = false;
            }
            if (e.keyCode == 32) {
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


    },
    Mob: function(mob,room){
        this.obj3D = mob;
        this.room = room;
        this.velocity = new THREE.Vector3(0,0,0);

        this.update = function(dt, player, dungeon) {            
            if(!this.obj3D.visible){ return; }
            this.obj3D.lookAt(player.obj3D.position); 
            var v = player.obj3D.position.clone();
            v.sub(this.obj3D.position);
            this.obj3D.position.add(v.normalize().multiplyScalar(0.01));

            dungeon.applyBounds(this,0.25,false); 
        }
        this.collidePlayer = function(player){
            player.applyDamage(10);
            player.applyBoost(0.5,250);  
            console.log("Damage From Mob!");
            this.obj3D.visible = false; 
        }
    },
    Crate: function(crate,room){
        this.obj3D = crate;
        this.collidePlayer = function(player){
            player.applyBoost(2,250);  
            this.obj3D.visible = false;
        }
    }
}

window.Instances = {
    
};
