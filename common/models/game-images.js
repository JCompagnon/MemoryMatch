'use strict';

module.exports = function (GameImages) {

    GameImages.remoteMethod('getImages', {
        accepts: [{ arg: 'number', type: 'number' }, { arg: 'theme', type: 'string' }],
        returns: { arg: 'result', type: 'array' }
    });

    GameImages.getImages = function (number, theme, cb) {
        //what are you talking about I totally know what I'm doing         
        //var themedPics = 
        GameImages.find({ where: { themes: theme }, limit: number }, function (err, pics) {            
            //TODO: add randomizing code
            //now that it's here do we want it here? this might be more game app logic than api's concern... welp... here we are
            //reference https://blog.codinghorror.com/the-danger-of-naivete/
            //let counter = pics.length;
            //for (let i = 0; i < pics.length; i++) {
            //    let index = Math.floor(Math.random() * counter);
            //    counter--;

            //    let temp = pics[counter];
            //    pics[counter] = pics[index];
            //    pics[index] = temp;
            //}

            //Temporary swapping of returned image urls to locally hosted ones (retrievved from )

            let fs = require('fs');

            fs.readdir("./client/sampleimages", function (err, files) {
                for (let s = 0; s < files.length && s < pics.length; s++) {
                    pics[s].sourceurl = "/sampleimages/" + files[s];
                }

                cb(null, pics);
            });            
        });
    };
};
