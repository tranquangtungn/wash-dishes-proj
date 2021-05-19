const config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        // scrollView: cc.ScrollView,
        content: cc.Node,
        pre_item: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.leaderBoard = JSON.parse(cc.sys.localStorage.getItem(config.storageKey.LEADERBOARD));
        // let item = cc.instantiate(this.pre_item)
        // cc.log(this.leaderBoard)
        // item.parent = this.content
        // let name = item.children[0].getComponent(cc.Label)
        // let score = item.children[1].getComponent(cc.Label)

        this.initLeaderBoard()
    },
    initLeaderBoard() {
        let len = this.leaderBoard.length
        for (let i = 0; i < len; i++) {
            let item = cc.instantiate(this.pre_item)
            item.parent = this.content
            let top = item.children[0].getComponent(cc.Label)
            let name = item.children[1].getComponent(cc.Label)
            let score = item.children[2].getComponent(cc.Label)
            top.string = i + 1 + "."
            name.string = this.leaderBoard[i].name
            score.string = this.leaderBoard[i].score
        }
    },
    start() {

    },
    scroll() {
        //cc.log(this.content.position)
    }

    // update (dt) {},
});
