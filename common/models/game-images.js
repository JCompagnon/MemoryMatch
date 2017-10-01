'use strict';

module.exports = function (GameImages) {
    
    //Each time a game image is retrieved through our server, update the counter on it
    GameImages.afterRemote('find', function (context, otherVar, next) {
        let imagesToUpdate = otherVar.map((img)=>img.id);

        GameImages.updateAll({ id: { inq: imagesToUpdate } }, { $inc: { timesused: 1 } }, function (error, info) { if (error) throw error; console.log(info.count); });
        next();
    });
};
