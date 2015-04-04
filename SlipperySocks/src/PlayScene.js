var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        this.addChild(new BackgroundLayer());
        this.addChild(new AnimationLayer());
    },
    space: null,
    initPhysics: function() {
        //1. new space object 
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, 0);
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});