var app = new Vue({
    el: "#app",
    data: {
        hello: "Hello, world!",
        welcome: "Welcome to Vue",
        titleLabel: "Memory Match",
        newGameLabel: "New game",
        selectedDiff: "",
        playerName: "",
        difficulties: [
            { text: "Easy", id: 0 },
            { text: "Normal", id: 1 },
            { text: "Hard", id: 2 },
        ]
    }
});