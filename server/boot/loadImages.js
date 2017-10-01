module.exports = function loadSessionData(app) {
    //Loads a few base urls for testing. Will prepopulate local db with sample images.
    let ftp = require('ftp');
    let fs = require('fs');
    let GameImages = app.models.GameImages;
    
    GameImages.count(null, function (err, count) {
        if (err) throw err;
        //if no images are loaded, the DB is fresh! and possibly remote - so try to get the creds for ftp, else fallback to included images
        if (count == 0) {
            //try first to use ftp credentials to load DB files
            try {
                let passKeys = require('../passkeys.json');
                if (passKeys) {
                    let okFTP = new ftp();
                    //so this is what they warned me about when they said callback hell.
                    okFTP.on('ready', function () {
                        okFTP.cwd('gameimages', function (err3, d) {
                            okFTP.list(function (err, list) {
                                if (err) throw err;
                                //Here we populate the DB, but we'll also write the gameimages list to a json, so that we can read from there instead of maintaining a backup list ourselves
                                let images = list.map(function (ftpImage) {
                                    if (ftpImage.name.endsWith('.png')) {
                                        let game = { sourceurl: passKeys.ftp.accessurl + ftpImage.name, themes: ['starterTheme'], timesused: 0 };
                                        GameImages.create(game);
                                        return game;
                                    }
                                }).filter(img => img && img.sourceurl != undefined);
                                fs.writeFile("server/sampleimages.json", JSON.stringify(images), 'utf8', function(err) {
                                    if (err) return console.log(err);
                                    console.log('sampleimages.json has been updated!');
                                });
                            });
                        });
                    });
                    okFTP.connect(passKeys.ftp);
                }
                else {
                    let sampleImages = require('../sampleimages.json').images;
                    sampleImages.forEach((game) => GameImages.create(game));
                }
            }
            catch (err) {
                let sampleImages = require('../sampleimages.json');
                sampleImages.forEach((game) => GameImages.create(game));
            }
        }
    });
}
