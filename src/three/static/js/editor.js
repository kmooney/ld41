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
        var $r = $('tr[y="'+room.y+'"] td[x="'+room.x+'"]')
        $r.addClass("room");

        if(room.walls.indexOf("l")>=0){ $r.addClass("_left"); }
        if(room.walls.indexOf("r")>=0){ $r.addClass("_right"); }
        if(room.walls.indexOf("t")>=0){ $r.addClass("_top"); }
        if(room.walls.indexOf("b")>=0){ $r.addClass("_bottom"); }

        for(var o=0;o<room.objects.length; o++){
            var obj = room.objects[o];
            var $o = $('<div class="_object '+obj.type+'"></div>').css({"top":(obj.y*10)+"px","left":(obj.x*10)+"px"});
            $r.append($o);
             
        }
    }
}

function saveMap(){
}

function init(){
    buildMap();
    loadMap();
}

init();


