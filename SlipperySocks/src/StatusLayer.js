var StatusLayer = cc.Layer.extend({
    candies:0,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();

        this.labelCandies = new cc.LabelTTF("Candies:0", "Helvetica", 20);
        this.labelCandies.setColor(cc.color(0,0,0));//black color
        this.labelCandies.setPosition(cc.p(70, winsize.height - 20));
        this.addChild(this.labelCandies);
    },

    incrementCandies:function(){
        this.candies += 1;
        this.labelCandies.setString("Candies:" + this.candies);
    }
});