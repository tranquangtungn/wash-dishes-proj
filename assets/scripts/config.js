let config = {
    event: {
        UPDATE_SOUND: "updateVolumn",
        UPDATE_EFFECT: "updateEffect",
        UPDATE_SCORE: "changeScore",
        UPDATE_GAMESTATE: "updateGameState",
        REMOVE_BULLET: "removeBullet",
        GAME_OVER: "over",
        ENEMY_DESTROY: 'enemyDestroy',
        WASH_DISHES: "washdishes",
        GAME_WIN:'gamewin'
    },
    gameState: {
        READY: "ready",
        PLAYING: "playing",
        OVER: "over",
        PAUSE: "pause",
        WIN:'win',
        // SETTINGS: "setting",
        // HEROSKINS: "skin",
        // RANKED: "ranked",
    },
    storageKey: {
        SETTINGS: "settings",
        LEADERBOARD: "leaderBoard"
    }
}

module.exports = config