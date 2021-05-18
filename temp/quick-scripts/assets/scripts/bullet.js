(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/bullet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be6d12xDUdIUbpIP74EIBB1', 'bullet', __filename);
// scripts/bullet.js

"use strict";

var mEmitter = require("mEmitter");
var config = require("config");
cc.Class({
    extends: cc.Component,
    properties: {
        damage: 1,
        speed: 5,
        _gameState: config.gameState.PLAYING,
        _updateGameState: null
    },
    onLoad: function onLoad() {
        this._updateGameState = this.updateGameState.bind(this);
        mEmitter.instance.registerEvent(config.event.UPDATE_GAMESTATE, this._updateGameState);
    },
    updateGameState: function updateGameState(data) {
        this._gameState = data;
    },
    start: function start() {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        var a = other.node.group == "enemy";
        if (other.node.group == "enemy") {
            this.onBulletKilled();
        }
    },
    onBulletKilled: function onBulletKilled() {
        mEmitter.instance.removeEvent(config.event.UPDATE_GAMESTATE, this._updateGameState);
        this.node.destroy();
    },
    update: function update(dt) {
        if (this._gameState == config.gameState.PLAYING) this.node.y += this.speed;
        if (this.node.y >= 460) {
            this.onBulletKilled();
        }
    }
});

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
        //# sourceMappingURL=bullet.js.map
        