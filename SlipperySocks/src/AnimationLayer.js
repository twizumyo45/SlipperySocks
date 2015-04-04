var AnimationLayer = cc.Layer.extend({
    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init:function () {
        this._super();

        //create the hero sprite
        var spriteCharacter = new cc.Sprite(res.stationary_kid_png);
        spriteCharacter.attr({x: 80, y: 85});

        this.addChild(spriteCharacter);
    }
});