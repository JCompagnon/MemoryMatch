'use strict';

module.exports = function (GameImage) {

    GameImage.remoteMethod('getImages', {
        accepts: [{ arg: 'number', type: 'number' }, { arg: 'theme', type: 'string' }],
        returns: { arg: 'result', type: 'array' }
    });

    GameImage.getImages = function (number, theme, cb) {
        //what are you talking about I totally know what I'm doing         
        var themedPics = GameImage.find({ where: { theme: theme }, limit: number }, function (err, pics) {
            if (pics.length < number) {
                //do some horrible mumbo jumbo. throw error? have multiples of the existing cards?
                //Also, are we looking at Plane A matching with Plane A, or Plane A with Plane B?
            }
            //TODO: add randomizing code
            //now that it's here do we want it here? this might be more game app logic than api's concern... welp... here we are
            //reference https://blog.codinghorror.com/the-danger-of-naivete/
            let counter = pics.length;
            for (let i = 0; i < pics.length; i++) {
                let index = Math.floor(Math.random() * counter);
                counter--;

                let temp = pics[counter];
                pics[counter] = pics[index];
                pics[index] = temp;
            }

            cb(null, pics);
        });
    };   
};