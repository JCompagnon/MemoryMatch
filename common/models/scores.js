'use strict';

module.exports = function (Score) {

    Score.remoteMethod('deleteScores', {
        accepts: [{ arg: 'scoreIDs', type: 'array', description: 'Set of IDs to be deleted' }],
        returns: {arg:'response', type:'Object',root:true}
    });
    Score.deleteScores = function (scoreIDs,cb) {
        if (scoreIDs.length) {
            Score.destroyAll({ id: { inq: scoreIDs } }, function (err, res) {
                if (err) throw err;
                cb(null, res);
            });
        }
    }
};
