(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/settings.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd948apsIutJyIYjN50I9aQH', 'settings', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=settings.js.map
        