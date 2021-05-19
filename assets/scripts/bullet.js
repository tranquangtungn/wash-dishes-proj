const mEmitter = require("mEmitter");
const config = require("config");
cc.Class({
    extends: cc.Component,
    properties: {
        damage: 1,
        speed: 5,
        _gameState: config.gameState.PLAYING,
        effect_src: {
            default: null,
            type: cc.AudioClip
        },
    },
    onLoad() {
        let js = this.node.parent.getComponent("game");
        this.effect = cc.audioEngine.play(this.effect_src, false, js.effectVolume);
        this._updateGameState = this.updateGameState.bind(this)
        mEmitter.instance.registerEvent(config.event.UPDATE_GAMESTATE, this._updateGameState)

    },
    updateEffect(number) {
        cc.log("test")
        cc.audioEngine.setVolume(this.effect, number);
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