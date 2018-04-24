BOUNDS = {left:-4,right:4,top:-2,bottom:2};

var Dungeon = function(){
    this.rooms = {}; 
    this.current = {x:0,y:0}; 
    this.currentRoom = null;
    this.bounds = BOUNDS;
}

Dungeon.prototype.room_hud = function(){
    var rooms = _.values(this.rooms); 
    var mx = {max:_.maxBy(rooms,"x").x,min:_.minBy(rooms,"x").x};
    var my = {max:_.maxBy(rooms,"y").y,min:_.minBy(rooms,"y").y};
    // gen xy grid of map
    var grid = [];
    for(var y=my.min; y<=my.max; y++){
        var row = [];
        grid.push(row);
        for(var x=mx.min;x<=mx.max;x++){
            var k = ""+x+","+y;
            if(this.rooms[k] != undefined){
                var room = this.rooms[k];
                row.push(room);
            }else{ row.push(null); }
        }
    }
    return {grid:grid,curx:this.current.x+mx.max,cury:this.current.y+my.max};
}

Dungeon.prototype.update = function(dt,player){
    if(this.currentRoom != null){
        this.currentRoom.update(dt,player,this);
    }  
}

Dungeon.prototype.applyBounds = function(player,radius,allow_change){
    var obj = player.obj3D;
    if(obj.position.x - radius < this.bounds.left){
        var r = this.left();
        if(r!=null && allow_change){ obj.position.x = this.bounds.right - radius;
        }else{ obj.position.x = this.bounds.left + radius; player.velocity.x = 0; } 
    }else if(obj.position.x + radius > this.bounds.right){
        var r = this.right();
        if(r!=null && allow_change){ obj.position.x = this.bounds.left + radius; 
        }else{ obj.position.x = this.bounds.right - radius; player.velocity.x = 0; }                
    }
    if(obj.position.z - radius < this.bounds.top){
        var r = this.up();
        if(r!=null && allow_change){ obj.position.z = this.bounds.bottom - radius; 
        }else{ obj.position.z = this.bounds.top + radius; player.velocity.z = 0; }                
    }else if(obj.position.z + radius > this.bounds.bottom){
        var r = this.down();
        if(r!=null && allow_change){ obj.position.z = this.bounds.top + radius; 
        }else{ obj.position.z = this.bounds.bottom - radius; player.velocity.z = 0; }                
    }
}

Dungeon.prototype.updateCurrentRoom = function(x,y){
    var k = ""+(this.current.x+x)+","+(this.current.y+y);

    if(this.rooms[k] != undefined){
        this.currentRoom.setVisible(false);
        this.currentRoom = this.rooms[k];
        this.currentRoom.setVisible(true);
        this.current.x += x;
        this.current.y += y;
   
        // notify minimap to update 
        var e = new Event("room-change");
        e.dungeon = this;
        document.dispatchEvent(e); 

        return this.currentRoom;
    }
    return null;
}

Dungeon.prototype.left = function(){
    return this.updateCurrentRoom(-1,0); 
}

Dungeon.prototype.right = function(){
    return this.updateCurrentRoom(1,0); 
}

Dungeon.prototype.up = function(){
    return this.updateCurrentRoom(0,1); 
}

Dungeon.prototype.down = function(){
    return this.updateCurrentRoom(0,-1); 
}

Dungeon.prototype.loadRooms = function(roomList,objectLibrary,scene){
    for(var i=0; i<roomList.length;i++){
        var r = roomList[i];
        var room = new Room(r.walls,r.x,r.y);
        room.loadObjects(r.objects,objectLibrary);
        this.rooms[""+r.x+","+r.y] = room;
        if(this.currentRoom == null){
            this.currentRoom = room;
        }
        room.addToScene(scene);
    }   
    this.updateCurrentRoom(0,0);
}

Dungeon.prototype.collide = function(p, r) {
    return this.currentRoom.collide(p, r);
}


var Room = function(walls,x,y){
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = walls; 
    this.obj3d = new THREE.Object3D();
    this.obj3d.visible = false; 
    this.obj3d.name = "Room-"+x+","+y;
    this.items = [];
}

Room.prototype.addWalls = function(objectLibrary){
    if(this.walls.indexOf("l") >= 0){
        var w = objectLibrary.Wall.clone();
        w.position.x = BOUNDS.left-0.5;
        w.scale.z = BOUNDS.bottom - BOUNDS.top + 2;
        this.obj3d.add(w);
    }
    if(this.walls.indexOf("r") >= 0){
        var w = objectLibrary.Wall.clone();
        w.position.x = BOUNDS.right+0.5;
        w.scale.z = BOUNDS.bottom - BOUNDS.top + 2;
        this.obj3d.add(w);
    }
    if(this.walls.indexOf("t") >= 0){
        var w = objectLibrary.Wall.clone();
        w.position.z = BOUNDS.top-0.5;
        w.scale.x = BOUNDS.right - BOUNDS.left + 2;
        this.obj3d.add(w);
    }
    if(this.walls.indexOf("b") >= 0){
        var w = objectLibrary.Wall.clone();
        w.position.z = BOUNDS.bottom+0.5;
        w.scale.x = BOUNDS.right - BOUNDS.left + 2;
        this.obj3d.add(w);
    }
}

Room.prototype.addToScene = function(scene){
    this.obj3d.visible = false;
    scene.add(this.obj3d);
}

Room.prototype.setVisible = function(visible){
    this.obj3d.visible = visible;
    this.visited = true;
}

Room.prototype.update = function(dt,player,dungeon){
    // TODO tick all objects
    return _.filter(this.items, function(i) {
        if(i.entity != undefined && i.entity.update != undefined){
            i.entity.update(dt,player,dungeon); 
        } 
    });
}

Room.prototype.loadObjects = function(obj_list,objectLibrary){
    this.addWalls(objectLibrary);
    for(var i=0; i<obj_list.length; i++){
        var o = obj_list[i];
        var instance = objectLibrary[o.type].clone();
        instance.position.x = o.x;
        instance.position.z = o.z;
        instance.geometry.computeBoundingSphere();
        if(Entities[obj_list[i].type] != undefined){
            instance.entity = new Entities[obj_list[i].type](instance,this);
        }
        this.obj3d.children.push(instance); 
        this.items.push(instance);
    } 
}

Room.prototype.collide = function(player, r){
    // TODO for every object in room, check if we collide with player
    return _.filter(this.items, function(i) {
        if(i.visible==false){ return false; }
        var d = i.position.distanceTo(player.obj3D.position);
        // warning! this will break if the models are not scaled by the same
        // factor for all dimensions.
        var collided = d < player.collideRadius * 2; // (r + (i.geometry.boundingSphere.radius * i.scale.x));
        if(collided && i.entity != undefined && i.entity.collidePlayer != undefined){
            i.entity.collidePlayer(player);
        } 
        return collided
    });
}
