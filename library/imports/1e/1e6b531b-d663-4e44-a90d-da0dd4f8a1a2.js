"use strict";
cc._RF.push(module, '1e6b5Mb1mNORKkN2g3U+KGi', 'game');
// scripts/game.js

"use strict";

var mEmitter = require("./mEmitter");
var config = require("config");

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

        sound_src: {
            default: null,
            type: cc.AudioClip
        },
        _waveNum: {
            default: 1,
            type: cc.Integer,
            notify: function notify(index) {
                this.initWave(this._waveNum);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.initLocalStorage();

        this._LayerList = [this.gameReadyLayer, this.gamePlayingLayer, this.gamePauseLayer, this.gameOverLayer, this.heroSkinsLayer, this.rankedLayer, this.settingsLayer];

        this.settings = JSON.parse(cc.sys.localStorage.getItem(config.storageKey.SETTINGS));
        this.effectVolume = this.settings.effectVolume;
        this.soundVolume = this.settings.soundVolume;
        this.sound = cc.audioEngine.play(this.sound_src, true, this.soundVolume);

        //cc.log(this._LayerList)
        mEmitter.instance = new mEmitter();
        //cc.log(config.event.UPDATE_SCORE)
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        this.getData();
        this.init();
        this.setTouch();

        mEmitter.instance.registerEvent(config.event.UPDATE_SOUND, this.setSoundVolume.bind(this));
        mEmitter.instance.registerEvent(config.event.UPDATE_EFFECT, this.setEffectVolume.bind(this));
        mEmitter.instance.registerEvent(config.event.UPDATE_SCORE, this.updateScore.bind(this));
        mEmitter.instance.registerEvent(config.event.GAME_OVER, this.gameFinished.bind(this));
    },
    initLocalStorage: function initLocalStorage() {
        var settings = JSON.parse(cc.sys.localStorage.getItem(config.storageKey.SETTINGS));
        if (!settings) {
            cc.log("no storage");
            settings = {
                soundVolume: 0.5,
                effectVolume: 0.5,
                currentWave: 1,
                currentScore: 0
            };
            cc.sys.localStorage.setItem(config.storageKey.SETTINGS, JSON.stringify(settings));
        }
        var leaderBoard = JSON.parse(cc.sys.localStorage.getItem(config.storageKey.LEADERBOARD));
        if (!leaderBoard) {
            cc.log("no storage");
            leaderBoard = [{
                name: "quangtung",
                score: 300
            }, {
                name: "quangtung",
                score: 200
            }, {
                name: "quangtung",
                score: 100
            }, {
                name: "quangtung",
                score: 300
            }, {
                name: "quangtung",
                score: 200
            }, {
                name: "quangtung",
                score: 100
            }, {
                name: "quangtung",
                score: 300
            }, {
                name: "quangtung",
                score: 200
            }, {
                name: "quangtung",
                score: 100
            }];
            cc.sys.localStorage.setItem(config.storageKey.LEADERBOARD, JSON.stringify(leaderBoard));
        }
    },
    start: function start() {},
    setSoundVolume: function setSoundVolume(number) {
        this.soundVolume = number;
        cc.audioEngine.setVolume(this.sound, this.soundVolume);
    },
    setEffectVolume: function setEffectVolume(number) {
        this.effectVolume = number;
    },
    update: function update(dt) {
        this.setBg();
        if (this.gameState == config.gameState.PLAYING) {
            this.bulletTime++;

            if (this.bulletTime == 10) {
                this.bulletTime = 0;
                this.createBullet();
            }
        }
    },
    init: function init() {
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
    },
    setTouch: function setTouch() {
        this.node.on("touchstart", function (event) {
            // this.gameState = config.gameState.PLAYING;
            // this.gameReadyLayer.active = false;
            // this.gamePlayingLayer.active = true;
            //this.gameOverLayer.active = false;
            //this.isBgMove = true;
        }, this);
        this.node.on("touchmove", function (event) {
            if (this._hero.name != "") {
                var pos_hero = this._hero.getPosition();
                var pos_mov = event.getDelta();
                var x = pos_hero.x + pos_mov.x;
                var y = pos_hero.y + pos_mov.y;
                if (x < 280 && x > -280) if (y < 400 && y > -400) this._hero.setPosition(cc.v2(x, y));
            }
        }, this);
        this.node.on("touchend", function (event) {
            cc.log("touchend");
        }, this);
    },
    gameFinished: function gameFinished() {
        this.gameState = config.gameState.OVER;
        this.removeAllBullet();
        this.removeAllEnemy();

        this.loadLayer(this.gameOverLayer);
        this.scoreOver.string = this.score.string;
    },
    createEnemy: function createEnemy(pre_enemy, index) {
        var x = index % this.allRow;
        var y = Math.floor(index / this.allRow);
        var enemy = cc.instantiate(pre_enemy);
        enemy.setPosition(0, 1000);
        var js = enemy.getComponent("enemy");
        js.speed = 2;
        js.targetpos = cc.v2(x * 100 - 100 * this.allRow / 2 + 50, y * 100);
        enemy.parent = this.node;
    },
    spawnHero: function spawnHero() {
        this._hero = cc.instantiate(this.pre_hero);
        this._hero.parent = this.node;
        this._hero.setPosition(cc.v2(0, -300));
    },
    updateScore: function updateScore(score) {
        //cc.log("tets")
        this.score.string = Number(this.score.string) + score;
        this.updateLevel();
    },
    updateLevel: function updateLevel() {
        this.level = Math.floor(this.score.string / 50) + 1;
    },
    setBg: function setBg() {
        if (this.isBgMove) {
            this.bg_2.y -= 0.5;
            this.bg_1.y -= 0.5;
            if (this.bg_1.y <= -this.bg_1.height) this.bg_1.y = this.bg_2.y + this.bg_1.height;
            if (this.bg_2.y <= -this.bg_2.height) this.bg_2.y = this.bg_1.y + this.bg_2.height;
        }
    },
    createBullet: function createBullet() {
        if (this._hero.name != "") {
            var pos = this._hero.getPosition();
            var bullet = cc.instantiate(this.pre_bullet);
            bullet.parent = this.node;
            bullet.setPosition(cc.v2(pos.x, pos.y + this._hero.height / 2));
        }
    },
    removeAllBullet: function removeAllBullet() {
        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var bullet = children[i].getComponent("bullet");
            if (bullet) bullet.onBulletKilled();
        }
    },
    removeAllEnemy: function removeAllEnemy() {
        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var enemy = children[i].getComponent("enemy");
            if (enemy) enemy.onEnemyKilled();
        }
    },
    removeHero: function removeHero() {
        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var enemy = children[i].getComponent("hero");
            if (enemy) {
                enemy.onHeroKilled();
            }
        }
    },
    loadLayer: function loadLayer(node) {
        var len = this._LayerList.length;
        for (var i = 0; i < len; i++) {
            if (this._LayerList[i] === node) this._LayerList[i].active = true;else this._LayerList[i].active = false;
        }
    },
    clickBtn: function clickBtn(sender, str) {
        //cc.log(str)
        switch (str) {
            case "play":
                this.spawnHero();
                this._waveNum = 1;
                mEmitter.instance.registerEvent(config.event.ENEMY_DESTROY, this.waveStatus.bind(this));
            case "resume":
                this.isBgMove = true;
                this.loadLayer(this.gamePlayingLayer);
                this.gameState = config.gameState.PLAYING;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState);
                break;
            case "pause":
                this.isBgMove = false;
                this.loadLayer(this.gamePauseLayer);
                this.gameState = config.gameState.PAUSE;
                mEmitter.instance.emit(config.event.UPDATE_GAMESTATE, this.gameState);
                break;
            case "restart":
                this.isBgMove = false;
                this.loadLayer(this.gameReadyLayer);
                this.gameState = config.gameState.READY;
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
                if (this.gameState == config.gameState.READY) this.loadLayer(this.gameReadyLayer);else if (this.gameState == config.gameState.PAUSE) this.loadLayer(this.gamePauseLayer);
                //this.saveLeaderBoard()
                this.saveSettings();
                break;
            default:
                break;
        }
    },
    saveLeaderBoard: function saveLeaderBoard() {},
    saveSettings: function saveSettings() {
        cc.log("save settings");
        var settings = {
            soundVolume: this.soundVolume,
            effectVolume: this.effectVolume,
            currentWave: 1,
            currentScore: 0
        };
        cc.sys.localStorage.setItem(config.storageKey.SETTINGS, JSON.stringify(settings));
    },

    //read json
    getData: function getData() {
        cc.loader.loadRes("waveconfig.json", this.getWaveData.bind(this));
    },
    getWaveData: function getWaveData(err, obj) {
        if (err) {
            cc.log(err);
            return;
        }
        this.waveContent = obj.json.wave;
        this.waveCount = obj.json.wavecount;
    },
    initWave: function initWave(waveNum) {
        var _this = this;

        if (1 > this.waveCount) {
            cc.log("overLoad");
            this.gameFinished();
            return;
        }
        cc.log(this.waveContent[waveNum]);
        var content = this.waveContent[waveNum].content;
        this.totalEnemy = this.waveContent[waveNum].enemy;
        this.allRow = this.waveContent[waveNum].allRow;
        this.allCol = this.waveContent[waveNum].allCol;
        cc.log(content);
        var title = "Wave " + waveNum;
        var sologan = this.waveContent[waveNum].sologan;
        var waveTitle = this.waveTitle.children;
        waveTitle[0].getComponent(cc.Label).string = title;
        waveTitle[1].getComponent(cc.Label).string = sologan;
        var blink = cc.blink(1, 3);
        var hide = cc.fadeTo(3, 0);
        var spawn = cc.spawn(hide, cc.callFunc(function () {
            content.map(function (item, index) {
                switch (item) {
                    case 1:
                        {
                            _this.createEnemy(_this.pre_creep, index);
                            break;
                        }
                    case 2:
                        {
                            _this.createEnemy(_this.pre_assassin, index);
                            break;
                        }
                    case 3:
                        {
                            _this.createEnemy(_this.pre_motherShip, index);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
            });
        }));
        var waveAction = cc.sequence(blink, spawn);
        this.waveTitle.runAction(waveAction);
    },
    waveStatus: function waveStatus() {
        this.totalEnemy--;
        cc.log(this.totalEnemy);
        if (this.totalEnemy == 0) {
            this._waveNum++;
            cc.log("Change wave");
        }
    }
});

cc._RF.pop();