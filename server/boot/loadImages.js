module.exports = function loadSessionData(app) {
    //Loads a few base urls for testing. Will prepopulate local db with sample images.
    let ftp = require('ftp');
    let fs = require('fs');
    let GameImages = app.models.GameImages;

    GameImages.count(null, function (err, count) {
        if (err) throw err;
        //if no images are loaded, the DB is fresh! and possibly remote - so try to get the creds for ftp, else fallback to included images
        if (!count) {
            //try first to use ftp credentials to load DB files - if no ftp credentials are found, or connection problems occur, use the local file to 
            GetFtpCredentials().then(ftpCreds => LoadFromFtp(ftpCreds)).catch(err => [])
                .then(images => images.length ? images : require("../sampleimages.json"))
                .then(images => images.forEach(image => GameImages.create(image)))
                .catch(err => console.log(err));
        }
    });
    /** Attempts to load images using FTP credentials, and returns a list of these images
     *
     */
    function LoadFromFtp(ftpCredentials) {
        return new Promise(function (resolve, reject) {
            let okFTP = new ftp();
            let images = [];
            //so this is what they warned me about when they said callback hell.
            okFTP.on('ready', function () {
                okFTP.cwd('gameimages', function (err, d) {
                    if (err) throw err;
                    okFTP.list(function (err2, list) {
                        if (err2) throw err2;
                        //Here we populate the DB, but we'll also write the gameimages list to a json, so that we can read from there instead of maintaining a backup list ourselves
                        let images = list.map(function (ftpImage) {
                            if (ftpImage.name.endsWith('.png')) {
                                let game = { sourceurl: ftpCredentials.accessurl + ftpImage.name, themes: ['starterTheme'], timesused: 0 };
                                return game;
                            }
                        }).filter(img => img && img.sourceurl);
                        fs.writeFile("server/sampleimages.json", JSON.stringify(images, null, 4), 'utf8', function (err3) {
                            if (err3) throw err3;
                            console.log('sampleimages.json has been updated!');
                        });
                        resolve(images);
                    });
                });
            });
            okFTP.on('error', reject);
            okFTP.connect(ftpCredentials);
        });
    }

    function GetFtpCredentials() {
        return new Promise(function (resolve, reject) {
            fs.stat("server/passkeys.json", function (err, stat) {
                if (err) reject(err);
                else {
                    fs.readFile("server/passkeys.json", "utf8", function (err, data) {
                        if (err) reject(err);
                        resolve(JSON.parse(data).ftp);
                    })
                }
            })
        })        
    }
}
