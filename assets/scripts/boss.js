// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const mEmitter = require("mEmitter");
const config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        turret: {
            default: null,
            type: cc.Sprite,
        },
        laser: {
            default: null,
            type: cc.Sprite,
        },
        // ammo_laser: {
        //     default: null,
        //     type: cc.Prefab
        // },
        _gameState: null,
        hp_bar: {
            default: null,
            type: cc.ProgressBar,
        },
        _angleTurret: 0,
        _hpBoss: {
            default: 50,
            serializable: false
        },
        _ready: false,
        _timer: 0
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._gameState = config.gameState.PLAYING
        this.tracking = this.trackingShip.bind(this)
        this.gameOver = this.gameOver.bind(this)
        mEmitter.instance.registerEvent("shipMoving", this.tracking);
        mEmitter.instance.registerEvent(config.event.GAME_OVER, this.gameOver)
    },
    updateGameState(data) {
        this._gameState = data;
        cc.log(data)
            // if (this._gameState == config.gameState.OVER) {
            //     cc.log(lol)
            //     this.node.destroy()
            // }
    },
    gameOver() {
        mEmitter.instance.removeEvent(config.event.GAME_OVER, this.gameOver)
        this.onKilled()
    },
    onKilled() {
        // mEmitter.instance.emit(config.event.ENEMY_DESTROY);
        // mEmitter.instance.removeEvent(
        //     config.event.UPDATE_GAMESTATE,
        //     this._updateGameState
        // );
        // mEmitter.instance.removeEvent("shipMoving", this.tracking)
        mEmitter.instance.removeEvent('shipMoving', this.tracking)
        this.node.destroy();
    },
    trackingShip(arg) {
        cc.log(arg)
        if (this._ready) {
            this._targetPos = arg
            let dir =
                Math.pow(arg.x - this.node.x, 2) + Math.pow(arg.y - this.node.y, 2);
            let opposite = Math.abs(arg.x - this.node.x);
            let hypotenuse = Math.sqrt(dir);
            let alpha = (Math.asin(opposite / hypotenuse) * 180) / Math.PI;
            let dirr = 1;
            if (arg.x > this.node.x) {
                dirr = -1;
            } else if (arg.x < this.node.x) {
                dirr = 1;
            }
            if (arg.y > this.node.y) {
                alpha = 90 - alpha + 90
            }
            this._angleTurret = -(alpha * dirr);
            this.turret.node.angle = this._angleTurret;
        }
        // cc.log(arg)
    },
    onCollisionEnter: function(other, self) {
        if (other.node.group == 'bullet') {
            cc.log(1 / this._hpBoss)
            this.hp_bar.progress += 1 / this._hpBoss
            cc.log(this.hp_bar.progress)
            if (this.hp_bar.progress >= 1) {
                this.outOfHp()
            }
        }
    },
    outOfHp() {
        mEmitter.instance.emit('bossout', this._hpBoss)
        this._ready = false
        this.node.stopAllActions()
        this.onKilled()
    },
    start() {
        let move = cc.moveTo(3, { y: 100, x: 0 })
        let seq = cc.sequence(move, cc.callFunc(() => {
            cc.log(this._hpBoss)
            this._ready = true
        }))
        this.node.runAction(seq)
    },
    onShoot() {
        mEmitter.instance.emit('golaser', this._angleTurret)
    },

    update(dt) {
        this._timer += dt
        if (this._ready) {
            if (this._timer > 2) {
                this.onShoot()
                this._timer = 0
            }
        }
    },
});