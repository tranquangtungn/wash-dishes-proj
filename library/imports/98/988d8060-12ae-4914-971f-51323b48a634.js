"use strict";
cc._RF.push(module, '988d8BgEq5JFJcfUTI7SKY0', 'config');
// scripts/config.js

"use strict";

var config = {
    event: {
        UPDATE_SCORE: "changeScore",
        UPDATE_GAMESTATE: "updateGameState",
        REMOVE_BULLET: "updateGameState",
        GAME_OVER: "over"
    },
    gameState: {
        READY: "ready",
        PLAYING: "playing",
        OVER: "over",
        PAUSE: "pause"
    }
};
module.exports = config;

cc._RF.pop();