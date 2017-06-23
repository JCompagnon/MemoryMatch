//Loads a few base urls for testing. Will prepopulate local db with sample images.
module.exports = function loadSessionData(app) {
    let GameImages = app.models.GameImages;

    GameImages.count(null, function (err, count) {
        if (err) throw err;
        if (count == 0) {
            let sampleImages = require('../sample-images.json').gameImageFields;
            for (let x = 0; x < sampleImages.ids.length; x++) {
                let sampleGameImage = { themes: sampleImages["themes"][x], sourceurl: sampleImages["urls"][x] };
                GameImages.create(sampleGameImage);
            }
        }
    });
}