'use strict';

module.exports = function(Score) {
    Score.addScore = function (score, player, callback) {
        //VALIDATE.VALIDATE.VALIDATE
        Score.create({ player: player, score: score });

    }
};
