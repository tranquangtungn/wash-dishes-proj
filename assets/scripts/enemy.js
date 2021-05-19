const mEmitter = require("mEmitter");
const config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        hit_frame: cc.SpriteFrame,
        hp: 5,
        speed: {
            set: function(value) {
                this._speed = value;
            },
        },

        targetpos: {
            set: function(value) {
                this._targetpos = value;
            },
        },

        score: 1,
        _sprite: null,
        _anim: null,
        _gameState: null,
        _updateGameState: null,
        _status: "move",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._gameState = config.gameState.PLAYING;
        this._sprite = this.getComponent(cc.Sprite);
        this.colider = this.getComponent(cc.PolygonCollider);
        this._anim = this.getComponent(cc.Animation);
        this._updateGameState = this.updateGameState.bind(this);
        mEmitter.instance.registerEvent(
            config.event.UPDATE_GAMESTATE,
            this._updateGameState
        );
    },
    updateGameState(data) {
        this._gameState = data;
        if (data != config.gameState.PLAYING) this._anim.stop();
        else this._anim.start();
    },
    onEnemyKilled() {
        mEmitter.instance.emit(config.event.ENEMY_DESTROY);
        mEmitter.instance.removeEvent(
            config.event.UPDATE_GAMESTATE,
            this._updateGameState
        );
        this.node.destroy();
    },
    onCollisionEnter: function(other, self) {
        if (other.node.group == "bullet") {
            this.hp -= 1;
            if (this.hp == 0) {
                this._anim.play(this._anim._clips[0]._name);
                cc.tween(this.node)
                    .delay(1)
                    .call(() => {
                        mEmitter.instance.emit(config.event.UPDATE_SCORE, this.score);
                        this.onEnemyKilled();
                    })
                    .start();
            } else if (this._sprite.spriteFrame !== this.hit_frame && this.hp > 0) {
                this._sprite.spriteFrame = this.hit_frame;
                this._anim.stop();
            }
        }
    },

    start() {
        this.onAction();
    },

    onPause() {
        this._status = "pause";
        this.node.stopAction(this._fly);
    },
    onAction() {
        cc.log(this._targetpos);
        var moveTo = cc.moveTo(3, this._targetpos);
        this._fly = cc.sequence(
            moveTo,
            cc.callFunc(() => {
                this._state = "idle";
            })
        );
        this.node.runAction(this._fly);
    },

    update(dt) {
        if (this._gameState == config.gameState.PAUSE && this._status == "move") {
            this.onPause();
        } else if (
            this._gameState == config.gameState.PLAYING &&
            this._status == "pause"
        ) {
            this.node.runAction(this._fly);
        }
    },
});