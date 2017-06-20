'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();

    loadSessionData(app);
});

function loadSessionData(app) {
    let images = app.models.gameImage;

    images.count(null, function (err, count) {
        if (err) throw err;
        if (count == 0) {
            let sampleImages = require('../server/sample-images.json').gameImageFields;
            for (let x = 0; x < sampleImages.ids.length; x++) {
                let sampleGameImage = { id: sampleImages["ids"][x], theme: sampleImages["themes"][x], sourceurl: sampleImages["urls"][x] };
                images.create(sampleGameImage);
            }
        }
    });
}
