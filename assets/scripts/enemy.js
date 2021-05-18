const mEmitter = require("mEmitter");
const config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        hit_frame: cc.SpriteFrame,
        hp: 5,
        speed: {
            set: function (value) {
                this._speed = value;
            },
        },

        score: 1,
        _sprite: null,
        _anim: null,
        _gameState: null,
        _updateGameState: null,
        //uwgduwgd

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._gameState = config.gameState.PLAYING
        this._sprite = this.getComponent(cc.Sprite)
        this.colider = this.getComponent(cc.PolygonCollider)
        this._anim = this.getComponent(cc.Animation)
        this._updateGameState = this.updateGameState.bind(this)
        mEmitter.instance.registerEvent(config.event.UPDATE_GAMESTATE, this._updateGameState)
    },
    updateGameState(data) {
        this._gameState = data
        if (data != config.gameState.PLAYING)
            this._anim.stop()
        else
            this._anim.start()
    },
    onEnemyKilled() {
        mEmitter.instance.removeEvent(config.event.UPDATE_GAMESTATE, this._updateGameState)
        this.node.destroy();
    },
    onCollisionEnter: function (other, self) {
        if (other.node.group == "bullet") {
            this.hp -= 1;
            if (this.hp == 0) {
                this._anim.play(this._anim._clips[0]._name)
                cc.tween(this.node)
                    .delay(1)
                    .call(() => {
                        mEmitter.instance.emit(config.event.UPDATE_SCORE, this.score)
                        this.onEnemyKilled()
                    })
                    .start()
            }
            else if (this._sprite.spriteFrame !== this.hit_frame && this.hp > 0) {
                this._sprite.spriteFrame = this.hit_frame
                this._anim.stop()
            }
        }
    },
    start() {
    },
    update(dt) {
        // if (this._gameState == config.gameState.PLAYING)
        //     this.node.y -= this._speed;
        // if (this.node.y <= -550) {
        //     this.onEnemyKilled()
        // }
    },
});
