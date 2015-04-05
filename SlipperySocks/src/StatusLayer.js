var StatusLayer = cc.Layer.extend({
    candies:0,
    life: MAX_LIFE,
    lifeLoss: 10,

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

        this.labelLife = new cc.LabelTTF("Life:" +  Math.floor(this.life/100), "Helvetica", 20);
        this.labelLife.setColor(cc.color(0,0,0));//black color
        this.labelLife.setPosition(cc.p(70, winsize.height - 50));
        this.addChild(this.labelLife);
    },

    incrementCandies:function(){
        this.lifeLoss += 5;
        this.candies += 1;
        this.life = MAX_LIFE;
        this.labelCandies.setString("Candies:" + this.candies);
        this.labelLife.setString("Life:" + Math.floor(this.life/100));
    },

    decrementLife:function(){
        cc.log("dec life");
        this.life -= this.lifeLoss;
        this.labelLife.setString("Life:" + Math.floor(this.life/100));

        return this.life;
    }
});