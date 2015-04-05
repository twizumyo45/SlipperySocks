var PlayScene = cc.Scene.extend({
	
	gotCandy:false,
	gameLayer:null,

    onEnter:function () {
        this._super();
        this.initPhysics();
/*
        //add three layer in the right order
        this.addChild(new BackgroundLayer());
        this.addChild(new AnimationLayer(this.space));
*/

        this.gameLayer = new cc.Layer();

        //add three layer in the right order
        this.gameLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.Background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);
        this.gameLayer.addChild(new StatusLayer(this.space), 0, TagOfLayer.Status);
        this.addChild(this.gameLayer);

        //run updates
        this.scheduleUpdate();
    },
    space: null,
    initPhysics: function() {
        // create the space
        this.space = new cp.Space();
        // turn off gravity
        this.space.gravity = cp.v(0, 0);
        // set damping
        this.space.damping = DAMPING_FACTOR;

        //add collision handler for kid to candy/wall
        this.space.addCollisionHandler(SpriteTag.thekid, SpriteTag.candy, this.collisionCandy.bind(this), null, null, null);
    },
    collisionCandy:function (arbiter, space) {
        this.gotCandy = true;
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);

        //check if out of boundries
        this.gameLayer.getChildByTag(TagOfLayer.Animation).checkBoundaries();

        //decrease life
        var life = this.gameLayer.getChildByTag(TagOfLayer.Status).decrementLife();

        //game over logic
        if (life <= 0)
        {
        	cc.log("==game over");
        	cc.director.pause();
        	this.addChild(new GameOverLayer());
        }

        //deal with candy collision
        if (this.gotCandy == true)
        {
            this.gameLayer.getChildByTag(TagOfLayer.Animation).removeCandy();
            this.gameLayer.getChildByTag(TagOfLayer.Status).incrementCandies();
            this.gotCandy = false; 
        }

    }
});