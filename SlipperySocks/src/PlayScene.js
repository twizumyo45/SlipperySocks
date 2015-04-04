var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.initPhysics();

        //add three layer in the right order
        this.addChild(new BackgroundLayer());
        this.addChild(new AnimationLayer(this.space));

        this.scheduleUpdate();
    },
    space: null,
    initPhysics: function() {
        // create the space
        this.space = new cp.Space();
        // turn off gravity
        this.space.gravity = cp.v(0, 0);
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});