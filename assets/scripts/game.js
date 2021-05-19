const mEmitter = require("./mEmitter");
const config = require("config");


cc.Class({
    extends: cc.Component,

    properties: {
        bg_1: cc.Node,
        bg_2: cc.Node,
        title: cc.Label,


        gameReadyLayer: cc.Node,
        gamePlayingLayer: cc.Node,
        gamePauseLayer: cc.Node,
        gameOverLayer: cc.Node,
        heroSkinsLayer: cc.Node,
        rankedLayer: cc.Node,
        settingsLayer: cc.Node,
        waveTitle: cc.Node,

        _LayerList: {
            default: [],
            type: [cc.Node]
        },

        score: cc.Label,
        scoreOver: cc.Label,

        pre_hero: cc.Prefab,
        _hero: cc.Node,

        pre_creep: cc.Prefab,
        pre_assassin: cc.Prefab,
        pre_motherShip: cc.Prefab,
        pre_bullet: cc.Prefab,


        sound_clip: {
            default: null,
            type: cc.AudioClip
        },
        _waveNum: {
            default: 1,
            type: cc.Integer,
            notify: function () {
                this.initWave(this._waveNum)
            }
        },
        _timer: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._LayerList = [
            this.gameReadyLayer,
            this.gamePlayingLayer,
            this.gamePauseLayer,
            this.gameOverLayer,
            this.heroSkinsLayer,
            this.rankedLayer,
            this.settingsLayer,
        ]
        var temp =cc.sys.localStorage.getItem('wave')
        cc.log('Content')
        cc.log(temp)
        this.sound = cc.audioEngine.play(this.sound_clip, true, 0);
        //cc.log(this._LayerList)
        mEmitter.instance = new mEmitter();
        //cc.log(config.event.UPDATE_SCORE)
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        this.getData()
        this.init();
        this.setTouch()
        mEmitter.instance.registerEvent(config.event.UPDATE_VOLUME, this.setSoundVolume.bind(this))
        mEmitter.instance.registerEvent(config.event.UPDATE_SCORE, this.updateScore.bind(this))
        mEmitter.instance.registerEvent(config.event.GAME_OVER, this.gameFinished.bind(this))
    },

    start() { },
    setSoundVolume(number) {
        cc.audioEngine.setVolume(this.sound, number);
    },
    update(dt) {
        this.setBg();
        if (this.gameState == config.gameState.PLAYING) {
            this.bulletTime++;
            this._timer += dt
            if (this.bulletTime == 10) {
                this.bulletTime = 0;
                this.createBullet();
            }
            // this.spawnCreeps(dt);
            // this.spawnAssassins(dt);
            // this.spawnMotherShips(dt);
        }
    },
    init() {
        this.isBgMove = false;
        this.bg_1.y = 0;
        this.bg_2.y = this.bg_1.y + this.bg_1.height;
        this.gameReadyLayer.zIndex = 1;
        // this.gameOverLayer.zIndex = -1;
        this.gamePauseLayer.zIndex = 2;
        //this.score.zIndex = 3;
        this.loadLayer(this.gameReadyLayer);
        this.bulletTime = 0;
        this.gameState = config.gameState.READY
        this.score.string = 0;

        this.spawnCreepTime = 0
        this.spawnAssasinTime = 0
        this.spawnMotherShipTime = 0
        this.level = 1
    },
    setTouch() {
        this.node.on("touchstart", function (event) {
            // this.gameState = config.gameState.PLAYING;
            // this.gameReadyLayer.active = false;
            // this.gamePlayingLayer.active = true;
            //this.gameOverLayer.active = false;
            //this.isBgMove = true;
        }, this);
        this.node.on("touchmove", function (event) {
            if (this._hero.name != "") {
                let pos_hero = this._hero.getPosition()
                let pos_mov = event.getDelta()
                let x = pos_hero.x + pos_mov.x
                let y = pos_hero.y + pos_mov.y
                if (x < 280 && x > -280)
                    if (y < 400 && y > -400)
                        this._hero.setPosition(cc.v2(x, y))
            }
        }, this);
        this.node.on("touchend", function (event) {
            cc.log("touchend")
        }, this)
    },
    gameFinished() {
        this.gameState = config.gameState.OVER;
        this.removeAllBullet()
        this.removeAllEnemy()

        this.loadLayer(this.gameOverLayer)
        this.scoreOver.string = this.score.string;
    },
    // spawnCreeps(dt) {
    //     this.spawnCreepTime += dt;
    //     if (this.spawnCreepTime >= 1 / this.level) {
    //         this.spawnCreepTime = 0;
    //         this.createEnemy(this.pre_creep, 1)
    //     }
    // },
    // spawnAssassins(dt) {
    //     this.spawnAssasinTime += dt;
    //     if (this.spawnAssasinTime >= 2 / this.level) {
    //         this.spawnAssasinTime = 0;
    //         this.createEnemy(this.pre_assassin, 2)
    //     }
    // },
    // spawnMotherShips(dt) {
    //     this.spawnMotherShipTime += dt;
    //     if (this.spawnMotherShipTime >= 5 / this.level) {
    //         this.spawnMotherShipTime = 0;
    //         this.createEnemy(this.pre_motherShip, 0.2)
    //     }
    // },
    createEnemy(pre_enemy, index) {
        let x = (index) % this.allRow
        let y = Math.floor(index / this.allRow);
        let enemy = cc.instantiate(pre_enemy)
        enemy.setPosition(0, 1000)
        let js = enemy.getComponent("enemy")
        js.speed=2
        js.targetpos=cc.v2(x * 100 - (100 * this.allRow / 2) + 50, y * 100)
        // var fly = cc.moveTo(3, cc.v2(x * 100 - (100 * this.allRow / 2) + 50, y * 100))
        // enemy.runAction(fly)
        // enemy.setMoveTo(x * 100 - (100 * this.allRow / 2) + 50,y*100)
        enemy.parent = this.node
    },
    spawnHero() {
        this._hero = cc.instantiate(this.pre_hero)
        this._hero.parent = this.node
        this._hero.setPosition(cc.v2(0, -300))
    },
    updateScore(score) {
        //cc.log("tets")
        this.score.string = Number(this.score.string) + score
        this.updateLevel();
    },
    updateLevel() {
        this.level = Math.floor(this.score.string / 50) + 1;
    },
    setBg() {
        if (this.isBgMove) {
            this.bg_2.y -= 0.5;
            this.bg_1.y -= 0.5;
            if (this.bg_1.y <= -this.bg_1.height)
                this.bg_1.y = this.bg_2.y + this.bg_1.height;
            if (this.bg_2.y <= -this.bg_2.height)
                this.bg_2.y = this.bg_1.y + this.bg_2.height;
        }
    },
    createBullet() {
        if (this._hero.name != "") {
            let pos = this._hero.getPosition()
            let bullet = cc.instantiate(this.pre_bullet)
            bullet.parent = this.node;
            bullet.setPosition(cc.v2(pos.x, pos.y + this._hero.height / 2))
        }
    },

    removeAllBullet() {
        let children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            let bullet = children[i].getComponent("bullet")
            if (bullet)
                bullet.onBulletKilled()
        }
    },
    removeAllEnemy() {
        let children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            let enemy = children[i].getComponent("enemy")
            if (enemy)
                enemy.onEnemyKilled()
        }
    },
    removeHero() {
        let children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            let enemy = children[i].getComponent("hero")
            if (enemy) {
                enemy.onHeroKilled()
            }
        }
    },
    loadLayer(node) {
        let len = this._LayerList.length
        for (let i = 0; i < len; i++) {
            if (this._LayerList[i] === node)
                this._LayerList[i].active = true;
            else
                this._LayerList[i].active = false;
        }
    },
    onDestroy(){
        cc.sys.localStorage.setItem('wave',JSON.stringtify(this.waveContent))
    },
    clickBtn(sender, str) {
        //cc.log(str)
        switch (str) {
            case "play":
                this.spawnHero();
                this._waveNum = 1
                mEmitter.instance.registerEvent(config.event.ENEMY_DESTROY, this.waveStatus.bind(this))
            case "resume":
                this.isBgMove = true;
                this.loadLayer(this.gamePlayingLayer)
                this.gameState = config.gameState.PLAYING;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState)
                break;
            case "pause":
                this.isBgMove = false;
                this.loadLayer(this.gamePauseLayer)
                this.gameState = config.gameState.PAUSE;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState)
                break;
            case "restart":
                this.isBgMove = false;
                this.loadLayer(this.gameReadyLayer)
                this.gameState = config.gameState.READY;
                this.removeAllBullet()
                this.removeAllEnemy()
                this.removeHero()
                this.init();
                break;
            case "skins":
                this.loadLayer(this.heroSkinsLayer)
                this.gameState = config.gameState.HEROSKINS;
                break;
            case "ranked":
                this.loadLayer(this.rankedLayer)
                this.gameState = config.gameState.RANKED;
                break;
            case "settings":
                this.loadLayer(this.settingsLayer)
                this.gameState = config.gameState.SETTINGS;
                break;
            case "back":
                this.loadLayer(this.gameReadyLayer)
                this.gameState = config.gameState.READY;
                break;
            default:
                break;
        }
    },
    //read json
    getData() {
        cc.loader.loadRes('waveconfig.json', this.getWaveData.bind(this))
    },
    getWaveData(err, obj) {
        if (err) {
            cc.log(err)
            return;
        }
        this.waveContent = obj.json.wave
        this.waveCount = obj.json.wavecount
    },
    waveStatus() {

    },
    initWave(waveNum) {

        if (1 > this.waveCount) {
            cc.log('overLoad');
            this.gameFinished()
            return;
        }
        cc.log(this.waveContent[waveNum])
        let content = this.waveContent[waveNum].content;
        this.totalEnemy = this.waveContent[waveNum].enemy;
        this.allRow = this.waveContent[waveNum].allRow;
        this.allCol = this.waveContent[waveNum].allCol;
        cc.log(content)
        let title = 'Wave ' + waveNum;
        let sologan = this.waveContent[waveNum].sologan;
        let waveTitle = this.waveTitle.getComponent('wavetitle')
        waveTitle.setWave(title, sologan)
        let blink = cc.blink(1, 3)
        let hide = cc.fadeTo(3, 0)
        let spawn = cc.spawn(hide, cc.callFunc(() => {
            content.map((item, index) => {
                switch (item) {
                    case 1:
                        {
                            this.createEnemy(this.pre_creep, index)
                            break;
                        }
                    case 2:
                        {
                            this.createEnemy(this.pre_assassin, index)
                            break;
                        }
                    case 3:
                        {
                            this.createEnemy(this.pre_motherShip, index)
                            break;
                        }
                    default: {
                        break;
                    }
                }
            })
        }))
        let waveAction = cc.sequence(blink, spawn)
        waveAction.setTag(1)
        this.waveTitle.runAction(waveAction)
    },
    waveStatus() {
        this.totalEnemy--
        cc.log(this.totalEnemy)
        if (this.totalEnemy == 0) {
            this._waveNum++
            cc.log('Change wave')
        }
    },
});