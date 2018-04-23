function buildMap(){
    console.log("generating map");
    var tsize = {w:BOUNDS.right-BOUNDS.left, h: BOUNDS.bottom-BOUNDS.top};

    var map_r = 5;

    var $t = $("#map");
    var html = '<table>';
    for(var y=map_r; y>=-map_r; y--){
        html += '<tr y="'+y+'">'
        for(var x=-map_r; x<=map_r; x++){
            html += '<td x="'+x+'"></td>';
            //var room = _.filter(DUNGEON_MAP,function(r){ return r.x==x && r.y==y; }); 
        } 
        html += '</tr>';
    }
    html += '</table>';
    $("#map").html(html);
}

function loadMap(){
    for(var r=0;r<DUNGEON_MAP.length; r++){
        var room = DUNGEON_MAP[r];
        updateGridRoom(room);
    }
    $("td").click(clickGridRoom);
}

function updateGridRoom(room){
        var $r = $('tr[y="'+room.y+'"] td[x="'+room.x+'"]')
        $r.addClass("room");
        $r[0].room = room;

        if(room.walls.indexOf("l")>=0){ $r.addClass("_left"); }else{ $r.removeClass("_left"); }
        if(room.walls.indexOf("r")>=0){ $r.addClass("_right"); }else{ $r.removeClass("_right"); }
        if(room.walls.indexOf("t")>=0){ $r.addClass("_top"); }else{ $r.removeClass("_top"); }
        if(room.walls.indexOf("b")>=0){ $r.addClass("_bottom"); }else{ $r.removeClass("_bottom"); }

        for(var o=0;o<room.objects.length; o++){
            var obj = room.objects[o];
            var $o = $('<div class="_object '+obj.type+'"></div>')
            $o.css("top",(obj.z+2)*10);
            $o.css("left",(obj.x+3)*10);
            $r.append($o);
             
        }
}

function clickGridRoom(e){
    $td = $(this);
    $("td.selected").removeClass("selected");
    $td.addClass("selected");
    var x = $td.attr("x");
    var y = $td.parent().attr("y");
    var room = $td[0].room;
    if(room == undefined){ return; }
    selectRoom(room);
}

function selectRoom(room){ 

    $room = $("#room");
    $("#current").html("("+room.x+","+room.y+")"+ (room!=undefined?" active":" inactive"));

    if(room.walls.indexOf("l")>=0){ $room.addClass("_left"); }else{ $room.removeClass("_left"); } 
    if(room.walls.indexOf("r")>=0){ $room.addClass("_right"); }else{ $room.removeClass("_right"); }
    if(room.walls.indexOf("t")>=0){ $room.addClass("_top"); }else{ $room.removeClass("_top"); }
    if(room.walls.indexOf("b")>=0){ $room.addClass("_bottom"); }else{ $room.removeClass("_bottom"); }

    console.log("selecting ",room);
    $("#room ._object").remove();
    for(var o=0;o<room.objects.length; o++){
        var obj = room.objects[o];
        var $o = $('<div class="_object '+obj.type+'"></div>')
        $o.css("top",(obj.z+2)*100);
        $o.css("left",(obj.x+3)*100);
        $o[0].obj_index = o;
        $room.append($o);
    }
    
}

function createRoom(){
    $td = $("td.selected");
    var x = $td.attr("x");
    var y = $td.parent().attr("y");
       
    if($td[0].room != undefined ){
        alert("Room already exists");
        return;
    }

    var room = {
        x: Number(x), y: Number(y),
        objects: [],
        walls: ""
    };
    $td[0].room = room;
    updateGridRoom(room);
}

function removeRoom(){
    $td = $("td.selected");
    if($td[0].room == undefined){
        alert( "No room to remove");
        return;
    }
    var room = $td[0].room;
    console.log("Removing",room);
    delete $td[0].room;
    $td.click();
}

function toggleWall(){
    var w = $(this).data("w")
    $td = $("td.selected");
    if($td[0].room == undefined){ return; };
    if($td[0].room.walls.indexOf(w) < 0){
        $td[0].room.walls += w;
    }else{
        $td[0].room.walls = $td[0].room.walls.replace(w,"");
    }  
    updateGridRoom($td[0].room);
    selectRoom($td[0].room);
}

function addEntity(e){
    $td = $("td.selected");
    if($td[0].room == undefined){ return; };
    var room = $td[0].room;
    var type = $("#entity").val();
    var parentOffset = $(this).parent().offset();
    var relX = e.pageX - this.offsetLeft;
    var relY = e.pageY - this.offsetTop;
    var obj = { x:(relX/100)-3, z:(relY/100)-2, type: type};
    console.log("adding to room",obj);
    room.objects.push(obj);
    updateGridRoom(room);
    selectRoom(room);
}

function clearEntities(){
    $td = $("td.selected");
    if($td[0].room == undefined){ return; };
    var room = $td[0].room;
    room.objects = [];
    updateGridRoom(room);
    selectRoom(room);
}

function saveMap(){
    var rooms = [];
    $("td").each(function(){
        if(this.room != undefined){
            rooms.push(this.room);
        }
    });    
    window.localStorage["Dungeon"] = JSON.stringify(rooms);
    console.log(JSON.stringify(rooms));
}

function init(){
    buildMap();
    loadMap();
    $("#create").click(createRoom);
    $("#remove").click(removeRoom);
    $("button.wall").click(toggleWall);
    $("#room").click(addEntity);
    $("#clear").click(clearEntities);
}

init();


