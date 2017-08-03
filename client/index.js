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
        gameInfo: {},
        difficulties: [
            { text: "Easy", id: 4 },
            { text: "Normal", id: 5 },
            { text: "Hard", id: 6 },
        ]
    },
    methods: {
        startGame: function (event) {
            axios.post('/api/gameimages/getImages', {
                number: app.selectedDiff
            }).then(function (response) {                
                var result = response.data.result;
                app.gameInfo = {
                    imagecount: result.length,
                    images: result
                }
            }).catch(function (err) { console.log(err) });
            //(for now) hide menu, replace with blocks for each image, add button to close game / return to menu
            app.currentScreen = "game";
        },
        quitGame: function (e) {
            app.currentScreen = "menu";
        }

    }
});