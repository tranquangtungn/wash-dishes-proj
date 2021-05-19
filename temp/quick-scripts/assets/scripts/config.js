(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '988d8BgEq5JFJcfUTI7SKY0', 'config', __filename);
// scripts/config.js

"use strict";

var config = {
    event: {
        UPDATE_VOLUME: "updateVolumn",
        UPDATE_SCORE: "changeScore",
        UPDATE_GAMESTATE: "updateGameState",
        REMOVE_BULLET: "removeBullet",
        GAME_OVER: "over",
        ENEMY_DESTROY: 'enemyDestroy'
    },
    gameState: {
        READY: "ready",
        PLAYING: "playing",
        OVER: "over",
        PAUSE: "pause",
        SETTINGS: "setting",
        HEROSKINS: "skin",
        RANKED: "ranked"
    }
};

module.exports = config;

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
        //# sourceMappingURL=config.js.map
        