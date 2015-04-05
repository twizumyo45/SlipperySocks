var res = {

	ghost_1_png: 'res/ghosts/ghost_1.png',
    ghost_plist: 'res/ghosts/ghost.plist',
    table_jpg: 'res/table.jpg',
    Koala_jpg : "res/Koala.jpg",
    bg_jpg : "res/bg.jpg",
    stationary_kid_png: 'res/stationary_kid.png',
    start_button_blue_jpg: 'res/play_button_small.png', // lol
    candy_png: 'res/candy.png',
    running_kid_png: 'res/texturePacker/running_kid.png',
    running_kid_plist: 'res/texturePacker/running_kid.plist',
    wall_png: 'res/wall.png',
    wall2_png: 'res/wall2.png'
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}