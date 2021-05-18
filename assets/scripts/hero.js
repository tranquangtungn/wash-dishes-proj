const mEmitter = require("mEmitter");
const config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        hit_frame: cc.SpriteFrame,
        _sprite: null,
        _anim_down: null
    },
    onLoad() {
        this._sprite = this.getComponent(cc.Sprite)
        this.colider = this.getComponent(cc.PolygonCollider)
        this._anim_down = this.getComponent(cc.Animation)
    },
    start() {
    },
    onCollisionEnter: function (other, self) {
        if (other.node.group == "enemy") {
            this._anim_down.play("hero_destroy")
            cc.tween(this.node)
                .delay(1)
                .call(() => { this.onHeroKilled() })
                .start()
        }
    },
    onHeroKilled() {
        mEmitter.instance.emit(config.event.GAME_OVER)
        this.node.destroy();
    },
});
