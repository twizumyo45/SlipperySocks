var PlayScene = cc.Scene.extend({
	
	shapesToRemove :[],
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
        this.addChild(this.gameLayer);

        //init the removal queue
        this.shapesToRemove = [];

        //run updates
        this.scheduleUpdate();
    },
    space: null,
    initPhysics: function() {
        // create the space
        this.space = new cp.Space();
        // turn off gravity
        this.space.gravity = cp.v(0, 0);

        //add collision handler for kid to candy/wall
        this.space.addCollisionHandler(SpriteTag.thekid, SpriteTag.candy, this.collisionCandy.bind(this), null, null, null);
    },
    collisionCandy:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] is the kid
        // shapes [1] is the candy 
        this.shapesToRemove.push(shapes[1]);
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);

        //check if out of boundries
        this.gameLayer.getChildByTag(TagOfLayer.Animation).checkBoundaries();

        //remove everything in the queue
        for(var i = 0; i < this.shapesToRemove.length; i++) {
            var shape = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(TagOfLayer.Animation).removeCandy();
        }
        this.shapesToRemove = [];

    }
});