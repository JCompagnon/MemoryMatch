//Loads a few base urls for testing. Will prepopulate local db with sample images.
let ftp = require('ftp');
let fs = require('fs');

module.exports = function loadSessionData(app) {
    let GameImages = app.models.GameImages;

    GameImages.count(null, function (err, count) {
        if (err) throw err;        
        if (count == 0) {
            //try first to use ftp credentials to load DB files
            try {
                let ftpConfig = require('../passkeys.json').ftp;
                let c = new ftp();
                //so this is what they warned me about when they said callback hell.
                c.on('ready', function () {
                    //we must go deeper!
                    c.cwd('gameimages', function (err3, d) {
                        //...but we dug too deep, and too greedily
                        c.list(function (err, list) {
                            if (err) throw err;
                            //we awakened an ancient ally of Melkor - the GameImage (::shrieks::)
                            let images = list.map(function (ftpImage) {
                                if (ftpImage.name.endsWith('.png')) {
                                    let game = { sourceurl: ftpConfig.accessurl + ftpImage.name, themes: ['starterTheme'], timesused: 0 };
                                    GameImages.create(game);
                                }
                            });
                        });
                    });
                });
                c.connect(ftpConfig);
            }
            catch (err) {
                let sampleImages = require('../sampleimages.json').images;
                sampleImages.forEach((game) => GameImages.create(game));
            }
        }
    });    
}
