var app = new Vue({
    el: "#app",
    data: {
        hello: "Hello, world!",
        welcome: "Welcome to Vue",
        titleLabel: "Memory Match",
        newGameLabel: "New game",
        quitGameLabel: "Quit",
        selectedDiff: "",
        playerName: "",
        currentScreen: "menu",
        shownImage: "",
        playerScore: 0,
        gameInfo: {
            imagecount: 0,
            images: []
        },
        difficulties: [
            { text: "Easy", id: 12 },
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
            }).catch(function (err) { console.log(err) });
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
            imgwrap.classList.toggle("obscured");
            //check if another image is chosen. 
            if (app.shownImage) {
                if (app.shownImage.src === img.getAttr('src') && app.shownImage.id != img.getAttr('id')) {                    
                    app.playerScore++;
                    console.log('image matched! Score: ' + app.playerScore);
                    //woopwoop refactor this what is wrong with you for god's sake man.
                    //also you should probably remove the images that matched
                }
                else {
                    console.log('Not a match');
                }
                
            }
            else {
                app.shownImage = { id: img.getAttr('id'), src: img.getAttr('src') }
            }
            
        },

        prepareImages: function (images) {
            //images should also have an id so that we can compare if the id differs
            var newArr = [];
            for (var x = 0; x < images.length; x++) {
                newArr.push(images[x]);
                newArr.push(images[x]);
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
        }
    }
});