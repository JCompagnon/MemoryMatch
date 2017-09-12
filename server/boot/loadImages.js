//Loads a few base urls for testing. Will prepopulate local db with sample images.
let ftp = require('ftp');

module.exports = function loadSessionData(app) {
    let GameImages = app.models.GameImages;
    let ftpConfig = require('../passkeys.json').ftp;    

    GameImages.count(null, function (err, count) {
        if (err) throw err;
        if (count == 0) {
            let c = new ftp();
            //so this is what they warned me about
            c.on('ready', function () {
                c.cwd('gameimages', function (err3, d) {
                    c.list(function (err, list) {
                        if (err) throw err;
                        //we have to go nestier!
                        let images = list.map(function (ftpImage) {
                            if (ftpImage.name.endsWith('.png')) {
                                let game = { sourceurl: ftpConfig.accessurl + ftpImage.name, themes: ['starterTheme'] };
                                GameImages.create(game);
                            }
                        });
                    });
                });
            });
            c.connect(ftpConfig);
        }
    });
}
