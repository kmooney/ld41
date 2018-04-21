

var Dungeon = function(){
    this.rooms = {}; 
    this.current = {x:0,y:0}; 
    this.currentRoom = null;
}

Dungeon.prototype.update = function(dt){
    if(this.currentRoom != null){
        this.currentRoom.update(dt);
    }  
}

Dungeon.prototype.updateCurrentRoom = function(){
    this.currentRoom.setVisible(false);
    var k = ""+this.current.x+","+this.current.y;
    if(this.rooms[k] != undefined){
        this.currentRoom = this.rooms[k];
        this.currentRoom.setVisible(true);
        return this.currentRoom;
    }
    console.error("Unknown room! "+k) 
}

Dungeon.prototype.left = function(){
    this.current.x -= 1;
    this.updateCurrentRoom(); 
}

Dungeon.prototype.right = function(){
    this.current.x += 1;
    this.updateCurrentRoom(); 
}

Dungeon.prototype.up = function(){
    this.current.y += 1;
    this.updateCurrentRoom(); 
}

Dungeon.prototype.down = function(){
    this.current.y -= 1;
    this.updateCurrentRoom(); 
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
    this.updateCurrentRoom();
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

