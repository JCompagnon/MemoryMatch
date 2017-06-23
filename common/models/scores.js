'use strict';

module.exports = function(Score) {
    Score.addScore = function (score, player, callback) {
        Score.create({ player: player, score: score });
    }
};