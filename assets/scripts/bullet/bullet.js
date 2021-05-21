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
        _action: null
    },
    action: function (action) {
        //cc.log("action parent bullet")
        if (action) {

            this._action = action
        }
        else
            this._action = cc.moveBy(1, 0, 800).repeatForever()

    },
    onLoad() {
        // this.action();
        // this.node.runAction(this._action)
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
        cc.log("update state")
        this._gameState = data
        if (this._gameState == config.gameState.PLAYING)
            this.node.resumeAllActions()
        else if (this._gameState == config.gameState.PAUSE)
            this.node.pauseAllActions()

    },
    start() {
        this.action(this._action);
        this.node.runAction(this._action)
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
        // if (this._gameState == config.gameState.PLAYING)
        //     this.node.y += this.speed;
        if (this.node.y >= 460) {
            this.onBulletKilled()
        }
    },
});