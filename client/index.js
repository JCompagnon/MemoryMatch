var app = new Vue({
    el: "#app",
    data: {
        screens: { highScores: 'highScores', menu:'menu', game:'game'},
        titleLabel: "Memory Match",
        newGameLabel: "New game",
        quitGameLabel: "Quit",
        selectedDiff: "",
        highScores: [],
        playerName: "",
        currentScreen: "menu",
        shownImage: "",
        matchedPairs: [],
        playerScore: 0,
        timeRemaining: 0,
        scoreMultiplier: 0,
        gameInfo: {
            imagecount: 0,
            images: []
        },
        difficulties: [
            { text: "Easy", id: 8 },
            { text: "Normal", id: 12 },
            { text: "Hard", id: 16 },
        ]
    },
    methods: {
        onNewGameClick: function () {
            app.playerName = document.getElementById('playerName').value;
            app.startGame(true);
        },
        startGame: function (newGameClick) {
            app.gameInfo.images.splice(0);
            let filter = { order: 'timesused ASC', limit: app.selectedDiff };
            axios.get('api/gameimages?filter=' + JSON.stringify(filter))
                .then(function (response) {
                    let result = response.data;
                    app.gameInfo.imagecount = result.length;
                    app.gameInfo.images = app.prepareImages(result);
                    app.matchedPairs = [];
                    if (newGameClick) {
                        app.startTimer();
                        app.playerScore = 0;
                    }
                    else {
                        //Add bonus time if player scored the board
                        app.timeRemaining += 15;
                        app.scoreMultiplier += 3;
                    }
                }).catch(function (err) { console.log(err) });
            //(for now) hide menu, replace with blocks for each image, add button to close game / return to menu
            app.currentScreen = "game";
        },
        quitGame: function () {
            app.currentScreen = "menu";
        },
        selectImage: function (e) {
            //get image-wrapper div(to handle show/hide)
            var imgwrap = e.target.tagName === 'DIV' ? e.target : e.target.parentElement;
            var img = imgwrap.children[0];
            if (!app.matchedPairs.includes(img.getAttribute('id'))) {
                imgwrap.classList.toggle("obscured");
                //check if another image is chosen. 
                if (app.shownImage) {
                    if (app.shownImage.src === img.getAttribute('src') && app.shownImage.id != img.getAttribute('id')) {
                        app.playerScore += (app.scoreMultiplier * 2);
                        console.log('image matched! Score: ' + app.playerScore);
                        //CHANGE OF PLAN we'll just not let anything interact with paired images
                        app.matchedPairs.push(...app.gameInfo.images.filter((s) => s.id === img.getAttribute('id') || s.id === app.shownImage.id).map((s) => s.id));
                        app.shownImage = undefined;
                        if (app.matchedPairs.length == (app.gameInfo.imagecount * 2)) {
                            setTimeout(app.startGame, 500);
                        }
                    }
                    else {
                        console.log('Not a match');
                        let shownImageId = app.shownImage.id;
                        app.shownImage = undefined;

                        setTimeout(function () {
                            document.getElementById(shownImageId).parentElement.classList.toggle("obscured");
                            imgwrap.classList.toggle("obscured");
                        }, 500);
                    }

                }
                else {
                    app.shownImage = { id: img.getAttribute('id'), src: img.getAttribute('src') }
                }
            }
        },
        prepareImages: function (images) {
            //images should also have an id so that we can compare if the id differs
            var newArr = [];
            for (var x = 0; x < images.length; x++) {
                newArr.push(images[x]);
                //sets the paired 
                newArr.push({ sourceurl: images[x].sourceurl, id: images[x].id.split('').reverse().join('') });
            }
            return UtilityMethods.shuffleArray(newArr);
        },
        startTimer: function () {
            app.scoreMultiplier = 6;
            app.timeRemaining = 30;
            app.reduceTime();
            app.reduceMultiplier();
        },
        reduceTime: function () {
            if (app.timeRemaining > 0) {
                app.timeRemaining--;
                setTimeout(app.reduceTime, 1000)
            }
        },
        reduceMultiplier: function () {
            if (app.scoreMultiplier > 0) {
                app.scoreMultiplier--;
                setTimeout(app.reduceMultiplier, 5000);
            }
            else {
                app.endGame();
            }
        },
        endGame: function () {
            app.showScores(true);
        },
        //what why not have this in client side code?
        destroyTestScores: function () {
            //gets a list of all ids of the currently-held scores and deletes the lot
            //should probably write a better method to destroy large numbers of records - too many requests, maaan
            axios.get('/api/scores').then(function (result) {
                axios.post('/api/scores/deletescores', { scoreIDs: result.data.map(s => s.id) });
            });
        },
        showScores: function (gameEnded) {
            if (gameEnded) {
                axios.post('/api/scores', {
                    player: (app.playerName || 'anon'),
                    score: app.playerScore
                }).then(function (postRes) {
                    let ignoreZeros = { where: { "score": { "gt": "0" } } };
                    axios.get('/api/scores?filter=' + JSON.stringify(ignoreZeros)).then(function (getRes) {
                        app.highScores = getRes.data.sort((a, b) => b.score - a.score);
                        setTimeout(() => { app.currentScreen = 'highScores'; setTimeout(() => { document.getElementById(postRes.data.id).scrollIntoView(); }, 0) }, 0);
                    });
                });
            }
            else {
                let ignoreZeros = { where: { "score": { "gt": "0" } } };
                axios.get('/api/scores?filter=' + JSON.stringify(ignoreZeros)).then(function (getRes) {
                    app.highScores = getRes.data.sort((a, b) => b.score - a.score);
                    app.currentScreen = 'highScores';
                });
            }
        }
    }
});


