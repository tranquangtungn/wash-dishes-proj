// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        sologan: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setWave(title, sologan) {
        cc.log(title + ':' + sologan)
        cc.log(this.title)
        this.title.string = title
        this.sologan.string = sologan
    },
    start() {

    },

    // update (dt) {},
});
