var AnimationLayer = cc.Layer.extend({
    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
        var kid = this.getChildByName("thekid");

        

        if (cc.sys.capabilities.hasOwnProperty('mouse'))
        {
            cc.eventManager.addListener(
            {
                event: cc.EventListener.MOUSE,

                onMouseDown: function(event)
                {
                    if (event.getButton() == cc.EventMouse.BUTTON_LEFT)
                    {
                        cc.log("mouse pressed at:" + event.getLocationX());

                        var actionTo = new cc.MoveTo(4, cc.p( event.getLocationX(),  event.getLocationY()));
                        kid.runAction(new cc.Sequence(actionTo));

                    }
                }, 

                onMouseUp: function(event)
                {
                    if (event.getButton() == cc.EventMouse.BUTTON_LEFT)
                    {
                        cc.log("released at:" + event.getLocationX());
                    }
                }
/*
                onMouseMove: function(event)
                { 
                    cc.log("moved to:" + event.getLocationX());
                }*/



            }, this);
        }

        return true; 
    },
    init:function () {
        this._super();

        //create the hero sprite
        var spriteCharacter = new cc.Sprite(res.stationary_kid_png);
        spriteCharacter.attr({x: 80, y: 85});
        spriteCharacter.setName("thekid");
        this.addChild(spriteCharacter);
    },

});