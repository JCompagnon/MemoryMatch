'use strict';

const images = [];

class GameImage {
    constructor(id, theme, url) {
        this.id = id;
        this.theme = theme;
        this.url = url;
    }
}

module.exports = function (memoryDB) {

    if (images.length === 0) {
        //let fs = require('fs');
        //let sampleImages;
        //fs.readFile("server/sample-images.json", (err, data) => {
        //    if (err) throw err;
        //    sampleImages = JSON.parse(data);


        //});
        let sampleImages = require('../../server/sample-images.json').gameImageFields;
        for (let x = 0; x < sampleImages.ids.length; x++) {
            let sampleGameImage = new GameImage(sampleImages["ids"][x], sampleImages["themes"][x], sampleImages["urls"][x]);
            images.push(sampleGameImage);
        }
    }

    return {
        //what are you talking about I totally know what I'm doing
        getImages: (number, theme) => {
            let themedPics = images.filter((image)=>image["theme"].indexOf(theme)!=-1) || [];
            if (number > themedPics.length) {
                throw {};
            }
            return themedPics.splice(0, number);
        },
        getImage: (id) => images.find({ id })
    }
};