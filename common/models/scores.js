'use strict';

module.exports = function (Score) {

    Score.remoteMethod('deleteScores', {
        accepts: [{ arg: 'scoreIDs', type: 'array', description: 'Set of IDs to be deleted' }]
    });
    Score.deleteScores = function (scoreIDs) {
        if (scoreIDs.length) {
            //not working
            Score.destroyAll({ id: { inq: scoreIDs } });
        }
    }
};
