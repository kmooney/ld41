var DUNGEON_MAP = [
    {
        x: 0, y: 0, 
        walls: "ltb", // lrtb if that side has an wall  
        objects: [
            {
                type: "Crate",
                x:1,
                z:1
            }
        ]
    },
    {
        x: 1, y: 0, 
        walls: "rt",
        objects: [
            {
                type: "Crate",
                x:-1,
                z:1
            }
        ]
    },
    {
        x: 1, y: -1, 
        walls: "lr", // lrtb if that side has an wall  
        objects: [
            {
                type: "Crate",
                x:2,
                z:1
            }
        ]
    },
    {
        x: 1, y: -2, 
        walls: "b", // lrtb if that side has an wall  
        objects: [
            {
                type: "Crate",
                x:2,
                z:1
            }
        ]
    },
    {
        x: 0, y: -2, 
        walls: "ltb", // lrtb if that side has an wall  
        objects: [
            {
                type: "Crate",
                x:2,
                z:1
            }
        ]
    },
    {
        x: 2, y: -2, 
        walls: "trb", // lrtb if that side has an wall  
        objects: [
            {
                type: "Crate",
                x:2,
                z:1
            }
        ]
    },

];
