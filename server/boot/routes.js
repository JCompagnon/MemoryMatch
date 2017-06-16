'use strict';

const gameimageservice = require('../../common/models/game-image')("memoryDB");

module.exports = function (app) {
    app.get('/getImages/:number-:theme', function (req, res) {
        res.send(gameimageservice.getImages(req.params.number, req.params.theme));
    });
}