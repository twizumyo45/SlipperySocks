var KID_START_X = 80;
var KID_START_Y = 95;

var ACCELERATION_POINT = cc.p(0, 0);

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Animation = 1;
};

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.thekid = 0;
    SpriteTag.candy = 1;
};