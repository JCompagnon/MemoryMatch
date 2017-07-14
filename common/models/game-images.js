﻿'use strict';

module.exports = function (GameImages) {

    GameImages.remoteMethod('getImages', {
        accepts: [{ arg: 'number', type: 'number' }, { arg: 'theme', type: 'string' }],
        returns: { arg: 'result', type: 'array' }
    });

    GameImages.getImages = function (number, theme, cb) {
        //what are you talking about I totally know what I'm doing         
        var themedPics = GameImages.find({ where: { themes: theme }, limit: number }, function (err, pics) {
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

            //themedPics.map(function GetElementsFromArray(item) {
            //    if (item.isArray) {
            //        item.map(GetElementsFromArray);
            //    }
            //    else {
            //        return item;
            //    }
            //});

            cb(null, pics);
        });
    };   
};