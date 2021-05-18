const mEmitter = require("mEmitter");
const config = require("config");
cc.Class({
    extends: cc.Component,
    properties: {
        damage: 1,
        speed: 5,
        _gameState: config.gameState.PLAYING,
        _updateGameState: null
    },
    onLoad() {
        this._updateGameState = this.updateGameState.bind(this)
        mEmitter.instance.registerEvent(config.event.UPDATE_GAMESTATE, this._updateGameState)
    },
    updateGameState(data) {
        this._gameState = data
    },
    start() {

    },
    onCollisionEnter: function (other, self) {
        let a = other.node.group == "enemy"
        if (other.node.group == "enemy") {
            this.onBulletKilled()

        }
    },
    onBulletKilled() {
        mEmitter.instance.removeEvent(config.event.UPDATE_GAMESTATE, this._updateGameState)
        this.node.destroy();

    },
    update(dt) {
        if (this._gameState == config.gameState.PLAYING)
            this.node.y += this.speed;
        if (this.node.y >= 460) {
            this.onBulletKilled()
        }
    },
});
