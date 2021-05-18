"use strict";
cc._RF.push(module, 'c58188CA11DBJcntZNGRtuq', 'hero');
// scripts/hero.js

"use strict";

var mEmitter = require("mEmitter");
var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        hit_frame: cc.SpriteFrame,
        _sprite: null,
        _anim_down: null
    },
    onLoad: function onLoad() {
        this._sprite = this.getComponent(cc.Sprite);
        this.colider = this.getComponent(cc.PolygonCollider);
        this._anim_down = this.getComponent(cc.Animation);
    },
    start: function start() {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        var _this = this;

        if (other.node.group == "enemy") {
            this._anim_down.play("hero_destroy");
            cc.tween(this.node).delay(1).call(function () {
                _this.onHeroKilled();
            }).start();
        }
    },
    onHeroKilled: function onHeroKilled() {
        mEmitter.instance.emit(config.event.GAME_OVER);
        this.node.destroy();
    }
});

cc._RF.pop();