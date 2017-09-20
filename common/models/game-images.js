'use strict';

module.exports = function (GameImages) {

    GameImages.remoteMethod('getImages', {
        accepts: [{ arg: 'number', type: 'number' }, { arg: 'theme', type: 'string' }],
        returns: { arg: 'result', type: 'array' }
    });

    GameImages.getImages = function (number, theme, cb) {
        //what are you talking about I totally know what I'm doing         
        //var themedPics = 
        GameImages.find({ where: { themes: theme }, order: 'timesused ASC', limit: number }, function (err, pics) {
            cb(null, pics);
        });
    };
    //Each time a game image is retrieved through our server, update the counter on it
    GameImages.afterRemote('getImages', function (context, otherVar, next) {
        let imagesToUpdate = otherVar.result.map((img)=>img.id);

        GameImages.updateAll({ id: { inq: imagesToUpdate } }, { $inc: { timesused: 1 } }, function (error, info) { if (error) throw error; console.log(info.count); });
        next();
    });
};
