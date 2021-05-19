let config = {
    event: {
        UPDATE_VOLUME: "updateVolumn",
        UPDATE_SCORE: "changeScore",
        UPDATE_GAMESTATE: "updateGameState",
        REMOVE_BULLET: "removeBullet",
        GAME_OVER: "over",
        ENEMY_DESTROY:'enemyDestroy'
    },
    gameState: {
        READY: "ready",
        PLAYING: "playing",
        OVER: "over",
        PAUSE: "pause",
        SETTINGS: "setting",
        HEROSKINS: "skin",
        RANKED: "ranked",
    },
}

module.exports = config
