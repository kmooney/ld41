

var Dungeon = function(){
    this.rooms = {}; 
    this.current = {x:0,y:0}; 
    this.currentRoom = null;
    this.bounds = {left:-5,right:5,top:-3,bottom:3};
}

Dungeon.prototype.update = function(dt){
    if(this.currentRoom != null){
        this.currentRoom.update(dt);
    }  
}

Dungeon.prototype.applyBounds = function(player){
    var kart = player.kart;
    if(kart.position.x < this.bounds.left){
        var r = this.left();
        if(r!=null){ kart.position.x = this.bounds.right;
        }else{ player.velocity.x = 0; }                
    }else if(kart.position.x > this.bounds.right){
        var r = this.right();
        if(r!=null){ kart.position.x = this.bounds.left; 
        }else{ player.velocity.x = 0; }                
    }
    if(kart.position.z < this.bounds.top){
        var r = this.up();
        if(r!=null){ kart.position.z = this.bounds.bottom; 
        }else{ player.velocity.z = 0; }                
    }else if(kart.position.z > this.bounds.bottom){
        var r = this.down();
        if(r!=null){ kart.position.z = this.bounds.top; 
        }else{ player.velocity.z = 0; }                
    }
}

Dungeon.prototype.updateCurrentRoom = function(x,y){
    var k = ""+(this.current.x+x)+","+(this.current.y+y);
    if(this.rooms[k] != undefined){
        console.log("changing to room "+k);
        this.currentRoom.setVisible(false);
        this.currentRoom = this.rooms[k];
        this.currentRoom.setVisible(true);
        this.current.x += x;
        this.current.y += y;
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
        var room = new Room(r.x,r.y);
        room.loadObjects(r.objects,objectLibrary);
        this.rooms[""+r.x+","+r.y] = room;
        if(this.currentRoom == null){
            this.currentRoom = room;
        }
        room.addToScene(scene);
    }   
    this.updateCurrentRoom(0,0);
}


var Room = function(type){
    this.type = type; 
    this.obj3d = new THREE.Object3D();
    this.obj3d.visible = false; 
}

Room.prototype.addToScene = function(scene){
    this.obj3d.visible = false;
    scene.add(this.obj3d);
}

Room.prototype.setVisible = function(visible){
    this.obj3d.visible = visible;
}

Room.prototype.update = function(dt){
    // TODO tick all objects
}

Room.prototype.loadObjects = function(obj_list,objectLibrary){
    for(var i=0; i<obj_list.length; i++){
        console.log("would load a "+obj_list[i].type+" to "+obj_list[i].pos);
        var o = obj_list[i];
        var instance = objectLibrary[o.type].clone();
        instance.position.x = o.x;
        instance.position.z = o.z;
        this.obj3d.children.push(instance); 
    } 
}

Room.prototype.collide = function(player){
    // TODO for every object in room, check if we collide with player  
    return [];
}
