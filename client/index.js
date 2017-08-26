var app = new Vue({
    el: "#app",
    data: {
        hello: "Hello, world!",
        welcome: "Welcome to Vue",
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
        scoreMultiplier: 0,
        gameInfo: {
            imagecount: 0,
            images: []
        },
        difficulties: [
            { text: "Easy", id: 4 },
            { text: "Normal", id: 16 },
            { text: "Hard", id: 20 },
        ]
    },
    methods: {
        startGame: function (event) {
            axios.post('/api/gameimages/getImages', {
                number: app.selectedDiff
            }).then(function (response) {
                var result = response.data.result;
                app.gameInfo.imagecount = result.length;
                app.gameInfo.images = app.prepareImages(result);
                app.matchedPairs = [];
                app.startTimer();
                }).catch(function (err) { console.log(err) });
            app.playerName = document.getElementById('name') ? document.getElementById('name').value : '';
            //(for now) hide menu, replace with blocks for each image, add button to close game / return to menu
            app.currentScreen = "game";
        },
        quitGame: function (e) {
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
                        //woopwoop refactor this what is wrong with you for god's sake man.
                        //also you should probably remove the images that matched
                        //CHANGE OF PLAN we'll just not let anything interact with paired images
                        app.matchedPairs.push(...app.gameInfo.images.filter((s) => s.id === img.getAttribute('id') || s.id === app.shownImage.id).map((s) => s.id));
                        app.shownImage = undefined;
                        if (app.matchedPairs.length == (app.gameInfo.imagecount * 2)) {
                            app.endGame();
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
                newArr.push({ sourceurl: images[x].sourceurl, id: images[x].id + '2' });
            }
            app.shuffleArray(newArr);
            return newArr;
        },
        shuffleArray: function (arr) {
            let counter = arr.length;
            for (let i = 0; i < arr.length; i++) {
                let index = Math.floor(Math.random() * counter);
                counter--;

                let temp = arr[counter];
                arr[counter] = arr[index];
                arr[index] = temp;
            }
        },

        startTimer: function () {
            app.scoreMultiplier = 6;

            app.reduceMultiplier();
        },
        reduceMultiplier: function () {
            if (app.scoreMultiplier > 1) {
                app.scoreMultiplier--;
                setTimeout(app.reduceMultiplier, 10000);
            }
        },
        endGame: function () {
            axios.post('/api/scores', {
                player: (app.playerName || 'anon'),
                score: app.playerScore
            }).then(function () {
                axios.get('/api/scores').then(function (result) {
                    app.highScores = result.data.sort((a,b)=>b.score-a.score);
                    setTimeout(() => { app.currentScreen = 'highScores' }, 0);
                })
            });            
        },
        //what why not have this in client side code?
        destroyTestScores: function () {
            //gets a list of all ids of the currently-held scores and deletes the lot
            //should probably write a better method to destroy large numbers of records - too many requests, maaan
            axios.get('/api/scores').then(function (result) {
                result.data.map(s => s.id).forEach(function (id) {
                    axios.delete('/api/scores/'+id);
                });
            });
        }
    }
});
