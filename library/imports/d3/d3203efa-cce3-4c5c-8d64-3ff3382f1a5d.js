"use strict";
cc._RF.push(module, 'd320376zONMXI1kP/M4Lxpd', 'enemy');
// scripts/enemy.js

"use strict";

var mEmitter = require("mEmitter");
var config = require("config");

var _require = require("./config"),
    gameState = _require.gameState;

cc.Class({
    extends: cc.Component,

    properties: {
        hit_frame: cc.SpriteFrame,
        hp: 5,
        speed: {
            set: function set(value) {
                this._speed = value;
            }
        },
        score: 1,
        targetpos: {
            set: function set(value) {
                cc.log(value);
                this._targetpos = value;
            }
        },
        _sprite: null,
        _anim: null,
        _gameState: null,
        _updateGameState: null,
        _status: 'move'

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this._gameState = config.gameState.PLAYING;
        this._sprite = this.getComponent(cc.Sprite);
        this.colider = this.getComponent(cc.PolygonCollider);
        this._anim = this.getComponent(cc.Animation);
        this._updateGameState = this.updateGameState.bind(this);
        mEmitter.instance.registerEvent(config.event.UPDATE_GAMESTATE, this._updateGameState);
    },

    // setMoveTo(x, y) {
    //     cc.log(y)
    // },
    updateGameState: function updateGameState(data) {
        this._gameState = data;
        if (data != config.gameState.PLAYING) this._anim.stop();else this._anim.start();
    },
    onEnemyKilled: function onEnemyKilled() {
        mEmitter.instance.emit(config.event.ENEMY_DESTROY);
        mEmitter.instance.removeEvent(config.event.UPDATE_GAMESTATE, this._updateGameState);
        this.node.destroy();
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        var _this = this;

        if (other.node.group == "bullet") {
            this.hp -= 1;
            if (this.hp == 0) {
                this._anim.play(this._anim._clips[0]._name);
                cc.tween(this.node).delay(1).call(function () {
                    mEmitter.instance.emit(config.event.UPDATE_SCORE, _this.score);
                    _this.onEnemyKilled();
                }).start();
            } else if (this._sprite.spriteFrame !== this.hit_frame && this.hp > 0) {
                this._sprite.spriteFrame = this.hit_frame;
                this._anim.stop();
            }
        }
    },

    start: function start() {
        this.onAction();
    },
    onPause: function onPause() {
        this._status = 'pause';
        this.node.stopAction(this._fly);
    },
    onAction: function onAction() {
        var _this2 = this;

        var moveTo = cc.moveTo(3, this._targetpos);
        this._fly = cc.sequence(moveTo, cc.callFunc(function () {
            _this2._state = 'idle';
        }));
        this.node.runAction(this._fly);
    },
    update: function update(dt) {
        if (this._gameState == config.gameState.PAUSE && this._status == 'move') {
            this.onPause();
        } else if (this._gameState == config.gameState.PLAYING && this._status == 'pause') {
            this.node.runAction(this._fly);
        }
    }
});

cc._RF.pop();