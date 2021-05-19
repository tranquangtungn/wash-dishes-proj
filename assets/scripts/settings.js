const mEmitter = require("./mEmitter");
const config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        soundSlider: cc.Slider,
        effectSlider: cc.Slider,
        muteAllToggle: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("hello")
        //cc.log(this)
        // mEmitter.instance.emit(config.event.UPDATE_VOLUME, 0.5)
    },
    setSound() {
        //cc.log(this.soundSlider.progress)
        mEmitter.instance.emit(config.event.UPDATE_SOUND, this.soundSlider.progress)
    },
    setEffect() {
        mEmitter.instance.emit(config.event.UPDATE_EFFECT, this.effectSlider.progress)
    },
    muteAll() {
        if (this.muteAllToggle.isChecked) {

            mEmitter.instance.emit(config.event.UPDATE_SOUND, 0)
            mEmitter.instance.emit(config.event.UPDATE_EFFECT, 0)
        }
        else {
            this.setEffect()
            this.setSound()
        }
    },

    start() {

    },

    // update (dt) {},
});
