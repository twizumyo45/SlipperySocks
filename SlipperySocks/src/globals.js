var KID_START_X = 80;
var KID_START_Y = 95;

var ACCELERATION_POINT = null;
var ACCELERATION_FACTOR = 2;
var DAMPING_FACTOR = 0.8;

var MAX_LIFE = 50000;

var MONSTER_IMPULSE_DELAY = 75;

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.Status = 2;
};

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.thekid = 0;
    SpriteTag.candy = 1;
    SpriteTag.wall = 2;
    SpriteTag.monster = 3;
    SpriteTag.obstacle = 4;
};

// direction types
if (typeof Direction == "undefined") {
	var Direction = {};
	Direction.north = 0;
	Direction.east = 1;
	Direction.south = 2;
	Direction.west = 3;
}