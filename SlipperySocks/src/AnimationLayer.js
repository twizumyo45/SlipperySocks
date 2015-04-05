var AnimationLayer = cc.Layer.extend({

  max_monsters: 5,
  max_obstacles: 5,
  monsters:[],
  obstacles:[],
  monsterImpulseTimer: 0,

  ctor: function(space) {
    this._super();
    this.space = space;
    this.init();
    ACCELERATION_POINT=null;
    this.kid = this.getChildByName("thekid");
    var kid = this.kid;


    //init monsters
    this.createMonsters();
    //init obstacles 
    this.createObstacles();
    this.initKidAnimation(kid);



    if( 'touches' in cc.sys.capabilities ) {
        this.setTouchEnabled(true);
        cc.eventManager.addListener({
        event: cc.EventListener.TOUCH,

        onTouchBegan: function(event) {
            this.onTouchMoved = this.onTouchMovedClicked;
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());
            kid.runAction(kid.runningAction);
        },

        onTouchEnded: function(event) {
            //todo: just turn off this listener
            this.onTouchMoved = function() {};

            ACCELERATION_POINT = null;

            // turn off animation
            kid.stopAllActions();
        },

        onTouchMovedClicked: function(event) {
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());
        }
      }, this);
    }
    else if (cc.sys.capabilities.hasOwnProperty('mouse')) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,

        onMouseDown: function(event) {
            this.onMouseMove = this.onMouseMoveClicked;
            ACCELERATION_POINT = cc.p(event.getLocationX(), event.getLocationY());
            kid.runAction(kid.runningAction);
        },

        onMouseUp: function(event) {
          if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
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
    var xPos = Math.floor((Math.random() * (winsize.width - 20))) + 20;
    var yPos = Math.floor((Math.random() * (winsize.height- 20))) + 20;
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

    //rmv all old monsters when a candy is gotten
    for (var i = 0; i < this.max_monsters; i++)
    {
        var monster = this.getChildByName("monster" + i);
        this.space.removeShape(monster.shape);
        monster.removeFromParent();
    }
    this.monsters = [];
    //increment max monsters (to increase difficulty)
    this.max_monsters += 1;
    //create new set of monsters
    this.createMonsters();

    //rmv all old obstacles when a candy is gotten
    for (var i = 0; i < this.max_obstacles; i++)
    {
        var obstacle = this.getChildByName("obstacle" + i);
        this.space.removeShape(obstacle.shape);
        obstacle.removeFromParent();
    }
    //increment max obstacles (to increase difficulty)
    this.max_obstacles += 1;
    //create new set of obstacles 
    this.createObstacles();
  },
  createMonsters:function () {
    for (var i = 0; i < this.max_monsters; i++)
    {

        var winsize = cc.director.getWinSize();
        //random dir stuff 
        var dir = Math.floor((Math.random() * 4));
        var impulseMagnitude = Math.floor((Math.random() * 50)) + 30;
        var xPos; 
        var yPos;
        var vec;
        if (dir == Direction.north)
        {
            vec = cp.v(0, impulseMagnitude);
            xPos = Math.floor((Math.random() * winsize.width));
            yPos = -20;
        }
        else if (dir == Direction.east)
        {
            vec = cp.v(impulseMagnitude, 0);
            xPos = -20;
            yPos = Math.floor((Math.random() * winsize.height));
        }
        else if (dir == Direction.south)
        {
            vec = cp.v(0, -1 * impulseMagnitude);
            xPos = Math.floor((Math.random() * winsize.width));
            yPos = winsize.height + 20;
        }
        else //west
        {
            vec = cp.v(-1 * impulseMagnitude, 0);
            xPos = winsize.width + 20;
            yPos = Math.floor((Math.random() * winsize.height));
        }

        var spriteMonster = cc.PhysicsSprite.createWithSpriteFrameName(res.ghost_1_png);

        spriteMonster.dirVect = vec; 

        var contentSize = spriteMonster.getContentSize();

        // init physics body
        spriteMonster.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        //var yPos = Math.floor((Math.random() * winsize.height));
        spriteMonster.body.p = cc.p(xPos, yPos);
        // add body to space
        this.space.addBody(spriteMonster.body);
        // create hitbox
        spriteMonster.shape = new cp.BoxShape(spriteMonster.body, contentSize.width - 14, contentSize.height);
        spriteMonster.shape.setCollisionType(SpriteTag.monster);
        // add shape to space
        this.space.addShape(spriteMonster.shape);
        // set body to the sprite
        spriteMonster.setBody(spriteMonster.body);

        spriteMonster.setName("monster" + i);
        
        this.monsters.push(spriteMonster);
        this.addChild(spriteMonster);

        this.initGhostAnimation(spriteMonster);

        spriteMonster.body.applyImpulse(spriteMonster.dirVect, cp.v(0, 0));
    }
    
  },
  createObstacles:function () {

    for (var i = 0; i < this.max_obstacles; i++)
    {
        var spriteObstacle = cc.PhysicsSprite.createWithSpriteFrameName(res.table_png);
        var contentSize = spriteObstacle.getContentSize();

        // init physics body
        spriteObstacle.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        // set position (randomized)
        var winsize = cc.director.getWinSize();
        var xPos = Math.floor((Math.random() * winsize.width));
        var yPos = Math.floor((Math.random() * winsize.height));
        spriteObstacle.body.p = cc.p(xPos, yPos);
        // add body to spacespriteObstacle
        this.space.addBody(spriteObstacle.body);
        // create hitbox
        spriteObstacle.shape = new cp.BoxShape(spriteObstacle.body, contentSize.width - 14, contentSize.height);
        spriteObstacle.shape.setCollisionType(SpriteTag.obstacle);
        // add shape to space
        this.space.addShape(spriteObstacle.shape);
        // set body to the sprite
        spriteObstacle.setBody(spriteObstacle.body);

        spriteObstacle.setName("obstacle" + i);
        this.obstacles.push(spriteObstacle);
        this.addChild(spriteObstacle);
    }
    
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
  monsterImpulse:function () {
    this.monsterImpulseTimer += 1;
    for (var i = 0; i < this.max_monsters; i++)
    {
        if (this.monsterImpulseTimer % MONSTER_IMPULSE_DELAY == 1)
        {
            this.monsters[i].body.applyImpulse(this.monsters[i].dirVect, cp.v(0, 0));
        }
    }
  },

  initKidAnimation: function(kid) {

    cc.spriteFrameCache.addSpriteFrames(res.running_kid_plist);

    // init runningAction
    var animFrames = [
        cc.spriteFrameCache.getSpriteFrame('sprite_1.png'),
        cc.spriteFrameCache.getSpriteFrame('sprite_2.png')
    ];

    var animation = new cc.Animation(animFrames, 0.08);
    kid.runningAction = new cc.RepeatForever(new cc.Animate(animation));
  },

  initGhostAnimation: function(ghost) {

    cc.spriteFrameCache.addSpriteFrames(res.ghost_plist);

    // init runningAction
    var animFrames = [
        cc.spriteFrameCache.getSpriteFrame('ghost_1.png'),
        cc.spriteFrameCache.getSpriteFrame('ghost_2.png')
    ];

    var animation = new cc.Animation(animFrames, 0.2);
    ghost.runningAction = new cc.RepeatForever(new cc.Animate(animation));
    ghost.runAction(ghost.runningAction);
  }


});
