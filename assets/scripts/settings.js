const mEmitter = require("./mEmitter");
const config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        soundSlider: cc.Slider,
        effectSlider: cc.Slider,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //cc.log(this)
        // mEmitter.instance.emit(config.event.UPDATE_VOLUME, 0.5)
    },
    setSound() {
        //cc.log(this.soundSlider.progress)
        mEmitter.instance.emit(config.event.UPDATE_VOLUME, this.soundSlider.progress)
    },

    start() {

    },

    // update (dt) {},
});
