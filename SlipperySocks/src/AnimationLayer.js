var AnimationLayer = cc.Layer.extend({

  ctor: function(space) {
    this._super();
    this.space = space;
    this.init();
    this.kid = this.getChildByName("thekid");
    var kid = this.kid;

    this.initKidAnimation(kid);

    if (cc.sys.capabilities.hasOwnProperty('mouse')) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,

        onMouseDown: function(event) {
          if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            cc.log("mouse pressed at:" + event.getLocationX() + "," + event.getLocationY());
            this.onMouseMove = this.onMouseMoveClicked;
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());
            kid.runAction(kid.runningAction);
          }
        },

        onMouseUp: function(event) {
          if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            cc.log("released at:" + event.getLocationX());
            //todo: just turn off this listener
            this.onMouseMove = function() {};

            ACCELERATION_POINT = null;

            // turn off animation
            kid.stopAllActions();
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
    var accel_vec = cp.v.mult(cp.v.normalize(cp.v.sub(click_vec, kid_vec)), ACCELERATION_FACTOR);
    this.kid.body.applyImpulse(accel_vec, cp.v(0, 0));

    // angle in degrees
    this.kid.rotation = -cp.v.toangle(accel_vec) * 57.29;

  },

  createCandy: function() {

    
    var spriteCandy = cc.PhysicsSprite.createWithSpriteFrameName(res.candy_png);
    var contentSize = spriteCandy.getContentSize();

    // init physics body
    spriteCandy.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
    // set position (randomized)
    var winsize = cc.director.getWinSize();
    var xPos = Math.floor((Math.random() * winsize.width));
    var yPos = Math.floor((Math.random() * winsize.height));
    spriteCandy.body.p = cc.p(xPos, yPos);
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
    this.space.removeShape(candy.shape);
    candy.removeFromParent();

    var newCandy = this.createCandy();
    this.addChild(newCandy);
  },
  checkBoundaries:function () {

    var winsize = cc.director.getWinSize();

    if (this.kid.body.p.x < 10 || this.kid.body.p.x > winsize.width - 10 || 
            this.kid.body.p.y < 10 || this.kid.body.p.y > winsize.height - 10)
    {
        this.kid.body.vx = 0;
        this.kid.body.vy = 0;
    }
  },

  initKidAnimation: function(kid) {

    // create sprite sheet
    cc.spriteFrameCache.addSpriteFrames(res.running_kid_plist);
    this.spriteSheet = new cc.SpriteBatchNode(res.running_kid_png);
    this.addChild(this.spriteSheet);

    // init runningAction
    var animFrames = [
        cc.spriteFrameCache.getSpriteFrame('sprite_1.png'),
        cc.spriteFrameCache.getSpriteFrame('sprite_2.png')
    ];

    var animation = new cc.Animation(animFrames, 0.08);
    kid.runningAction = new cc.RepeatForever(new cc.Animate(animation));
  }


});
