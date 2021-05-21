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
        winLayer: cc.Node,

        _LayerList: {
            default: [],
            type: [cc.Node],
        },

        score: cc.Label,
        scoreOver: cc.Label,
        nameOver: cc.EditBox,

        pre_hero: cc.Prefab,
        _hero: cc.Node,

        pre_creep: cc.Prefab,
        pre_assassin: cc.Prefab,
        pre_motherShip: cc.Prefab,
        pre_boss: cc.Prefab,
        ammoturret: cc.Prefab,

        pre_bullet: cc.Prefab,
        pre_skillBullet: cc.Prefab,
        pre_skillShield: cc.Prefab,

        chargeSkill: cc.ProgressBar,

        sound_src: {
            default: null,
            type: cc.AudioClip,
        },
        _waveNum: {
            default: 1,
            type: cc.Integer,
            notify: function() {
                this.initWave(this._waveNum);
            },
        },
        _isWashDishes: false,
        // anim_hero: null,
        // anim_node: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initLocalStorage();

        this._LayerList = [
            this.gameReadyLayer,
            this.gamePlayingLayer,
            this.gamePauseLayer,
            this.gameOverLayer,
            this.heroSkinsLayer,
            this.rankedLayer,
            this.settingsLayer,
            this.winLayer,
        ];

        this.settings = JSON.parse(
            cc.sys.localStorage.getItem(config.storageKey.SETTINGS)
        );
        this.effectVolume = this.settings.effectVolume;
        this.soundVolume = this.settings.soundVolume;
        this.sound = cc.audioEngine.play(this.sound_src, true, this.soundVolume);

        //cc.log(this._LayerList)
        mEmitter.instance = new mEmitter();
        //cc.log(config.event.UPDATE_SCORE)
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;

        this.init();
        this.setTouch();


        mEmitter.instance.registerEvent(
            config.event.UPDATE_SOUND,
            this.setSoundVolume.bind(this)
        );
        mEmitter.instance.registerEvent(
            config.event.UPDATE_EFFECT,
            this.setEffectVolume.bind(this)
        );
        mEmitter.instance.registerEvent(
            config.event.UPDATE_SCORE,
            this.updateScore.bind(this)
        );
        mEmitter.instance.registerEvent(
            config.event.GAME_OVER,
            this.gameFinished.bind(this)
        );
    },
    initLocalStorage() {
        let settings = JSON.parse(
            cc.sys.localStorage.getItem(config.storageKey.SETTINGS)
        );
        if (!settings) {
            cc.log("no storage");
            settings = {
                soundVolume: 0.5,
                effectVolume: 0.5,
                currentWave: 1,
                currentScore: 0,
            };
            cc.sys.localStorage.setItem(
                config.storageKey.SETTINGS,
                JSON.stringify(settings)
            );
        }
        let leaderBoard = JSON.parse(
            cc.sys.localStorage.getItem(config.storageKey.LEADERBOARD)
        );
        if (!leaderBoard) {
            cc.log("no storage");
            leaderBoard = [{
                    name: "quangtung",
                    score: 1,
                },
                {
                    name: "quangtung",
                    score: 20,
                },
                {
                    name: "quangtung",
                    score: 3,
                },
                {
                    name: "quangtung",
                    score: 5,
                },
                {
                    name: "quangtung",
                    score: 200,
                },
                {
                    name: "quangtung",
                    score: 50,
                },
                {
                    name: "quangtung",
                    score: 300,
                },
                {
                    name: "quangtung",
                    score: 200,
                },
                {
                    name: "quangtung",
                    score: 100,
                },
            ];
            cc.sys.localStorage.setItem(
                config.storageKey.LEADERBOARD,
                JSON.stringify(leaderBoard)
            );
        }
    },

    washDishes() {
        this._isWashDishes = true;
        let positon = [
            cc.v2(-20, -20),
            cc.v2(-10, -10),
            cc.v2(0, 0),
            cc.v2(10, -10),
            cc.v2(20, -20),
        ];
        if (this._hero.name != "") {
            for (let i = 0; i < 5; i++) {
                let pos = this._hero.getPosition();
                let bullet = cc.instantiate(this.pre_skillShield);
                bullet.parent = this.node;
                bullet.setPosition(cc.v2(pos.x, pos.y + this._hero.height / 2));
                let js = bullet.getComponent("bullet");
                let anim = cc.sequence(
                    cc.spawn(
                        cc.moveBy(0.5, 0, 20),
                        cc.sequence(cc.delayTime(0.1 * i), cc.rotateBy(0.5, 360 * 2))
                    ),
                    cc.delayTime(0.1 * (5 - i)),
                    cc.moveBy(0.1, positon[i], positon[i]),
                    cc.delayTime(0.4),

                    cc.rotateBy(6, 360 * 120),
                    cc.callFunc(() => {
                        js.onBulletKilled();
                        this._isWashDishes = false;
                    })
                );
                js.action(anim);
                let anim_hero = cc.sequence(
                    cc.delayTime(1.5),
                    cc.repeat(
                        cc.sequence(
                            cc.spawn(cc.scaleTo(0.1, 1.1), cc.tintTo(0.1, 10, 50, 150)),
                            cc.spawn(cc.scaleTo(0.1, 1), cc.tintTo(0.1, 255, 255, 255))
                        ),
                        32
                    )
                );
                this._hero.runAction(anim_hero);
                let anim_node = cc.sequence(
                    cc.delayTime(1.5),
                    cc.repeat(
                        cc.sequence(
                            cc.callFunc(() => {
                                this.createKnife(i);
                            }),
                            cc.delayTime(0.1)
                        ),
                        64
                    )
                );
                this.node.runAction(anim_node);
            }
        }
    },
    createKnife(i) {
        if (this._hero.name != "") {
            //cc.log("washes dish")
            let pos = this._hero.getPosition();
            let posList = [
                cc.v2(pos.x - 20, pos.y - 20 + this._hero.height / 2 + 20),
                cc.v2(pos.x - 10, pos.y - 10 + this._hero.height / 2 + 20),
                cc.v2(pos.x, pos.y + this._hero.height / 2 + 20),
                cc.v2(pos.x + 10, pos.y - 10 + this._hero.height / 2 + 20),
                cc.v2(pos.x + 20, pos.y - 20 + this._hero.height / 2 + 20),
            ];
            let num = Math.floor(Math.random() * 5);
            let knife = cc.instantiate(this.pre_skillBullet);
            knife.parent = this.node;
            knife.setPosition(posList[i]);
            knife.angle = 20 - 10 * i;
            let js = knife.getComponent("bullet");
            let anim = cc.moveBy(
                1, -800 * Math.tan(cc.misc.degreesToRadians(knife.angle)),
                800
            );
            js.action(anim);
        }
    },
    start() {},

    setSoundVolume(number) {
        this.soundVolume = number;
        cc.audioEngine.setVolume(this.sound, this.soundVolume);
    },
    setEffectVolume(number) {
        this.effectVolume = number;
    },
    update(dt) {
        //cc.log(this.node.children)
        this.setBg();
        if (
            this.gameState == config.gameState.PLAYING &&
            this._isWashDishes == false
        ) {
            this.bulletTime++;

            if (this.bulletTime == 10) {
                this.bulletTime = 0;
                //this.washDishes()
                this.createBullet();
            }
        }
    },
    init() {

        this.isBgMove = false;
        this.bg_1.y = 0;
        this.bg_2.y = this.bg_1.y + this.bg_1.height;
        this.gameReadyLayer.zIndex = 1;
        // this.gameOverLayer.zIndex = -1;
        this.gamePauseLayer.zIndex = 2;
        this.settingsLayer.zIndex = 2;
        //this.score.zIndex = 3;
        this.loadLayer(this.gameReadyLayer);
        this.bulletTime = 0;
        this.gameState = config.gameState.READY;
        this.score.string = 0;

        this.spawnCreepTime = 0;
        this.spawnAssasinTime = 0;
        this.spawnMotherShipTime = 0;
        this.level = 1;
        this._waveStart = 1;
        this.getData();
        //this._waveNum = 1;
    },
    setTouch() {
        this.node.on("touchstart", function(event) {}, this);
        this.node.on(
            "touchmove",
            function(event) {
                //this.washDishes();
                if (this._hero.name != "") {
                    let pos_hero = this._hero.getPosition();
                    let pos_mov = event.getDelta();
                    let x = pos_hero.x + pos_mov.x;
                    let y = pos_hero.y + pos_mov.y;
                    let pos = cc.v2(x, y) || cc.v2(0, -500)
                    mEmitter.instance.emit("shipMoving", pos);
                    if (x < 280 && x > -280)
                        if (y < 400 && y > -400) {
                            this._hero.setPosition(
                                cc.v2(pos_hero.x + pos_mov.x, pos_hero.y + pos_mov.y)
                            );
                            let skill = this.node.getComponentsInChildren("skillShield");
                            skill.forEach((element) => {
                                let pos_elm = element.node.getPosition();
                                element.node.setPosition(
                                    cc.v2(pos_elm.x + pos_mov.x, pos_elm.y + pos_mov.y)
                                );
                            });
                        }
                }
            },
            this
        );
        this.node.on(
            "touchend",
            function(event) {
                cc.log("touchend");
            },
            this
        );
    },
    gameFinished() {
        this.gameState = config.gameState.OVER;
        this.removeAllBullet();
        this.removeAllEnemy();

        this.loadLayer(this.gameOverLayer);
        this.scoreOver.string = this.score.string;
        let index = this.checkLeaderBoard(Number(this.score.string));
        cc.log(index);
        if (index) {
            this.nameOver.node.active = true;
        } else {
            this.nameOver.node.active = false;
        }
    },
    checkLeaderBoard(score) {
        let leaderBoard = JSON.parse(
            cc.sys.localStorage.getItem(config.storageKey.LEADERBOARD)
        );
        for (let i = 0; i < leaderBoard.length; i++) {
            cc.log(leaderBoard[i].score);
            if (leaderBoard[i].score <= score) {
                return true;
            }
        }
        return false;
    },
    saveLeaderBoard() {
        let leaderBoard = JSON.parse(
            cc.sys.localStorage.getItem(config.storageKey.LEADERBOARD)
        );
        let name = "unknown";
        if (this.nameOver.string) name = this.nameOver.string;
        let topUser = {
            name: name,
            score: Number(this.scoreOver.string),
        };
        leaderBoard.pop();
        leaderBoard.push(topUser);
        for (let i = 0; i < leaderBoard.length - 1; i++)
            for (let j = i + 1; j < leaderBoard.length; j++) {
                if (leaderBoard[i].score < leaderBoard[j].score) {
                    let temp = leaderBoard[i];
                    leaderBoard[i] = leaderBoard[j];
                    leaderBoard[j] = temp;
                }
            }
        cc.sys.localStorage.setItem(
            config.storageKey.LEADERBOARD,
            JSON.stringify(leaderBoard)
        );
    },
    createEnemy(pre_enemy, index) {
        let x = index % this.allRow;
        let y = Math.floor(index / this.allRow);
        let enemy = cc.instantiate(pre_enemy);
        enemy.setPosition(0, 1000);
        let js = enemy.getComponent("enemy");
        js.speed = 2;
        js.targetpos = cc.v2(x * 100 - (100 * this.allRow) / 2 + 50, y * 100);
        enemy.parent = this.node;
    },
    spawnHero() {
        this._hero = cc.instantiate(this.pre_hero);
        this._hero.parent = this.node;
        this._hero.setPosition(cc.v2(0, -300));
    },
    updateScore(score) {
        //cc.log("tets")
        this.score.string = Number(this.score.string) + score;
        this.updateLevel();
        this.charge();
    },
    charge() {
        if (!this._isWashDishes && this.chargeSkill.progress < 1)
            cc.tween(this.chargeSkill).by(0.5, { progress: 0.1 }).start();
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
            let pos = this._hero.getPosition();
            let bullet = cc.instantiate(this.pre_bullet);
            bullet.parent = this.node;
            bullet.setPosition(cc.v2(pos.x, pos.y + this._hero.height / 2 + 2));
        }
    },

    removeAllBullet() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let bullet = children[i].getComponent("bullet");
            if (bullet) bullet.onBulletKilled();
        }
    },
    removeAllEnemy() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let enemy = children[i].getComponent("enemy");
            if (enemy) enemy.onEnemyKilled();
        }
    },
    removeHero() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let enemy = children[i].getComponent("hero");
            if (enemy) {
                cc.log("hero killed");
                enemy.onHeroKilled();
            }
        }
    },
    loadLayer(node) {
        let len = this._LayerList.length;
        for (let i = 0; i < len; i++) {
            if (this._LayerList[i] === node) this._LayerList[i].active = true;
            else this._LayerList[i].active = false;
        }
    },
    clickBtn(sender, str) {
        //cc.log(str)
        switch (str) {
            case "play":
                this.spawnHero();
                this.enemydestroy = this.waveStatus.bind(this)
                this._waveNum = 5;
                mEmitter.instance.registerEvent(
                    config.event.ENEMY_DESTROY,
                    this.enemydestroy
                );
                this.isBgMove = true;
                this.loadLayer(this.gamePlayingLayer);
                this.gameState = config.gameState.PLAYING;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState);
                //this.washDishes();
                break;
            case "resume":
                this.isBgMove = true;
                this.loadLayer(this.gamePlayingLayer);
                this.gameState = config.gameState.PLAYING;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState);
                this.resumeAllActions();
                break;
            case "pause":
                this.isBgMove = false;
                this.loadLayer(this.gamePauseLayer);
                this.gameState = config.gameState.PAUSE;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState);
                this.pauseAllActions();
                break;
            case "restart":
                this.isBgMove = false;
                this.saveLeaderBoard();
                mEmitter.instance.removeEvent(
                    config.event.ENEMY_DESTROY,
                    this.enemydestroy
                );
                this.loadLayer(this.gameReadyLayer);
                this.gameState = config.gameState.READY;
                this.stopAllActions();
                this.removeAllBullet();
                this.removeAllEnemy();
                this.removeHero();
                this.init();
                break;
            case "skins":
                this.loadLayer(this.heroSkinsLayer);
                //this.gameState = config.gameState.HEROSKINS;
                break;
            case "ranked":
                this.loadLayer(this.rankedLayer);
                //this.gameState = config.gameState.RANKED;
                break;
            case "settings":
                this.loadLayer(this.settingsLayer);
                // this.gameState = config.gameState.SETTINGS;
                break;
            case "back":
                if (this.gameState == config.gameState.READY)
                    this.loadLayer(this.gameReadyLayer);
                else if (this.gameState == config.gameState.PAUSE)
                    this.loadLayer(this.gamePauseLayer);
                //this.saveLeaderBoard()
                this.saveSettings();

                break;
            case "washDishes":
                if (this.chargeSkill.progress >= 1) {
                    this.washDishes();
                    cc.tween(this.chargeSkill)
                        .delay(1.5)
                        .to(6.4, { progress: 0 }) // node.scale === 2
                        // node.scale === 2
                        .start();
                }
                break;
            default:
                break;
        }
    },
    pauseAllActions() {
        cc.log("pause");
        this.node.pauseAllActions();
        this._hero.pauseAllActions();
    },
    resumeAllActions() {
        cc.log("resume");
        this.node.resumeAllActions();
        this._hero.resumeAllActions();
    },
    stopAllActions() {
        cc.log("resume");
        this.node.stopAllActions();
        this._hero.stopAllActions();
        this.waveTitle.stopAllActions();
    },

    saveSettings() {
        cc.log("save settings");
        let settings = {
            soundVolume: this.soundVolume,
            effectVolume: this.effectVolume,
            currentWave: 1,
            currentScore: 0,
        };
        cc.sys.localStorage.setItem(
            config.storageKey.SETTINGS,
            JSON.stringify(settings)
        );
    },
    //read json
    getData() {
        cc.log("get data");
        cc.loader.loadRes("waveconfig.json", this.getWaveData.bind(this));
    },
    getWaveData(err, obj) {
        if (err) {
            cc.log(err);
            return;
        }
        this.waveContent = obj.json.wave;
        this.waveCount = obj.json.wavecount;
    },
    initWave(waveNum) {
        cc.log(waveNum);
        this.updatescore = this.updateScore.bind(this);

        if (waveNum > this.waveCount) {
            this.gameFinished();
            return;
        }
        let content = this.waveContent[waveNum].content;
        this.totalEnemy = this.waveContent[waveNum].enemy;
        this.allRow = this.waveContent[waveNum].allRow;
        this.allCol = this.waveContent[waveNum].allCol;
        let title = "Wave " + waveNum;
        let sologan = this.waveContent[waveNum].sologan;
        let waveTitle = this.waveTitle.children;
        waveTitle[0].getComponent(cc.Label).string = title;
        waveTitle[1].getComponent(cc.Label).string = sologan;
        let blink = cc.blink(1, 3);
        let hide = cc.fadeTo(3, 0);
        let spawn = cc.spawn(
            hide,
            cc.callFunc(() => {
                content.map((item, index) => {
                    switch (item) {
                        case 1:
                            {
                                this.createEnemy(this.pre_creep, index);
                                break;
                            }
                        case 2:
                            {
                                this.createEnemy(this.pre_assassin, index);
                                break;
                            }
                        case 3:
                            {
                                this.createEnemy(this.pre_motherShip, index);
                                break;
                            }
                        case 5:
                            {
                                this.createBoss(this.pre_boss, index);
                            }
                        default:
                            {
                                break;
                            }
                    }
                });
            })
        );
        let waveAction = cc.sequence(blink, spawn);
        this.waveTitle.runAction(waveAction);
    },
    waveStatus() {
        if (this.gameState == config.gameState.PLAYING) {
            this.totalEnemy--;
            cc.log(this.totalEnemy);
            cc.log(mEmitter.instance);
            if (this.totalEnemy == 0) {
                this._waveNum++;

            }
        }
    },
    onWin(arg) {
        this.gameState = config.gameState.WIN;
        this.loadLayer(this.winLayer);
        this.updateScore(arg);
        let label = this.winLayer.children;
        label.map((item) => {
            if (item.name == "totalscore") {
                item.getComponent(cc.Label).string = "Score: " + this.score.string;
            }
        });
        this._hero.destroy();
        this.removeAllBullet();
    },
    onBossShoot(arg) {
        let ammo = cc.instantiate(this.ammoturret);
        ammo.angle = arg - 90;
        ammo.setPosition(cc.v2(0, 80));
        ammo.parent = this.node;
        cc.tween(ammo)
            .to(0.5, { y: this._hero.y, x: this._hero.x })
            .call(() => {
                ammo.destroy();
            })
            .start();
    },
    createBoss(pre_enemy, index) {
        let x = index % this.allRow;
        let y = Math.floor(index / this.allRow);
        let enemy = cc.instantiate(pre_enemy);
        enemy.setPosition(0, -1000);
        enemy.parent = this.node;
        mEmitter.instance.registerEvent("bossout", this.onWin.bind(this));
        mEmitter.instance.registerEvent("golaser", this.onBossShoot.bind(this));
    },
});