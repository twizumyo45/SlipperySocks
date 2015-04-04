

var AnimationLayer = cc.Layer.extend({

  ctor: function(space) {
    this._super();
    this.space = space;
    this.init();
    this.kid = this.getChildByName("thekid");


    if (cc.sys.capabilities.hasOwnProperty('mouse')) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,

        onMouseDown: function(event) {
          if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            cc.log("mouse pressed at:" + event.getLocationX());
            this.onMouseMove = this.onMouseMoveClicked;
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());
          }
        },

        onMouseUp: function(event) {
          if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            cc.log("released at:" + event.getLocationX());
            //todo: just turn off this listener
            this.onMouseMove = function() {};

            ACCELERATION_POINT = null;
          }
        },

        onMouseMoveClicked: function(event) {
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());

        }
      }, this);
    }

    this.scheduleUpdate();
    return true;
  },
  init: function() {
    this._super();

    // create kid sprite
    var spriteCharacter = cc.PhysicsSprite.createWithSpriteFrameName(res.stationary_kid_png);
    var contentSize = spriteCharacter.getContentSize();

    // set anchor point
    // spriteCharacter.anchorX = 0.5;
    // spriteCharacter.anchorY = 0.5;

    // init physics body
    spriteCharacter.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
    // set position
    spriteCharacter.body.p = cc.p(KID_START_X, KID_START_X + contentSize.height / 2);
    // add body to space
    this.space.addBody(spriteCharacter.body);
    // create hitbox
    spriteCharacter.shape = new cp.BoxShape(spriteCharacter.body, contentSize.width - 14, contentSize.height);
    spriteCharacter.shape.setCollisionType(SpriteTag.thekid);
    // add shape to space
    this.space.addShape(spriteCharacter.shape);
    // set body to the sprite
    spriteCharacter.setBody(spriteCharacter.body);

    spriteCharacter.setName("thekid");

    //create first candy 
    var spriteCandy = this.createCandy();


    this.addChild(spriteCharacter);
    this.addChild(spriteCandy);
  },

  update: function(dt) {
    this.accelerate(ACCELERATION_POINT);
  },

  accelerate: function(point) {
    if (!ACCELERATION_POINT) {
        return;
    }

    var kid_vec = cp.v(this.kid.body.p.x, this.kid.body.p.y);
    var click_vec = cp.v(point.x, point.y);
    var accel_vec = cp.v.normalize(cp.v.sub(click_vec, kid_vec));
    this.kid.body.applyImpulse(accel_vec, cp.v(0, 0));

    // angle in degrees
    this.kid.rotation = -cp.v.toangle(accel_vec) * 57.29;

  },

  createCandy: function() {

    //todo: randomize spawn 
    var spriteCandy = cc.PhysicsSprite.createWithSpriteFrameName(res.candy_png);
    var contentSize = spriteCandy.getContentSize();

    // init physics body
    spriteCandy.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
    // set position
    spriteCandy.body.p = cc.p(KID_START_X + 80, KID_START_X + contentSize.height / 2);
    // add body to space
    this.space.addBody(spriteCandy.body);
    // create hitbox
    spriteCandy.shape = new cp.BoxShape(spriteCandy.body, contentSize.width - 14, contentSize.height);
    spriteCandy.shape.setCollisionType(SpriteTag.candy);
    // add shape to space
    this.space.addShape(spriteCandy.shape);
    // set body to the sprite
    spriteCandy.setBody(spriteCandy.body);

    spriteCandy.setName("candy");

    return spriteCandy;
  },
  removeCandy:function () {
    var candy = this.getChildByName("candy");
    this.removeChild(candy);
  },


});
