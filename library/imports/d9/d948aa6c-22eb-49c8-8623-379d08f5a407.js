"use strict";
cc._RF.push(module, 'd948apsIutJyIYjN50I9aQH', 'settings');
// scripts/settings.js

"use strict";

var mEmitter = require("./mEmitter");
var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        soundSlider: cc.Slider,
        effectSlider: cc.Slider
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //cc.log(this)
        // mEmitter.instance.emit(config.event.UPDATE_VOLUME, 0.5)
    },
    setSound: function setSound() {
        //cc.log(this.soundSlider.progress)
        mEmitter.instance.emit(config.event.UPDATE_VOLUME, this.soundSlider.progress);
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();