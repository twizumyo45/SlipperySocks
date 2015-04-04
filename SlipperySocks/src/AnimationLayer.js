
KID_START_X = 80;
KID_START_Y = 95;

var AnimationLayer = cc.Layer.extend({
    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init:function () {
        this._super();
        
        // create kid sprite
        var spriteCharacter = cc.PhysicsSprite.createWithSpriteFrameName(res.stationary_kid_png);
        var contentSize = spriteCharacter.getContentSize();

        // init physics body
        spriteCharacter.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        // set position
        spriteCharacter.body.p = cc.p(KID_START_X, KID_START_X + contentSize.height / 2);
        // add body to space
        this.space.addBody(spriteCharacter.body);
        // create hitbox
        spriteCharacter.shape = new cp.BoxShape(spriteCharacter.body, contentSize.width - 14, contentSize.height);
        // add shape to space
        this.space.addShape(spriteCharacter.shape);
        // set body to the sprite
        spriteCharacter.setBody(spriteCharacter.body);

        this.addChild(spriteCharacter);
    }
});