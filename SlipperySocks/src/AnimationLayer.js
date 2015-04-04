var AnimationLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        //create the hero sprite
        var spriteCharacter = new cc.Sprite(res.stationary_kid_png);
        spriteCharacter.attr({x: 80, y: 85});

        //create the move action
        var actionTo = new cc.MoveTo(2, cc.p(300, 85));
        spriteCharacter.runAction(new cc.Sequence(actionTo));
        this.addChild(spriteCharacter);
    }
});