// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const Emitter = require("mEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
        turret: {
            default: null,
            type: cc.Sprite,
        },
        laser: {
            default: null,
            type: cc.Sprite,
        },
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Emitter.instance.registerEvent("shipMoving", this.trackingShip.bind(this));
    },
    trackingShip(arg) {
        let dir =
            Math.pow(arg.x - this.node.x, 2) + Math.pow(arg.y - this.node.y, 2);
        let opposite = Math.abs(arg.x - this.node.x);
        let hypotenuse = Math.sqrt(dir);
        let alpha = (Math.asin(opposite / hypotenuse) * 180) / Math.PI;
        let dirr = 1;
        if (arg.x > this.node.x) {
            dirr = -1;
        } else if (arg.x < this.node.x) {
            dirr = 1;
        }
        if (arg.y > this.node.y) {
            alpha = 90 - alpha + 90
        }
        this.turret.node.angle = -(alpha * dirr);
    },

    start() {},

    // update (dt) {},
});