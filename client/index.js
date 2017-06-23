var app;
window.addEventListener('load', function () {
    app = new Vue({
        el: "#app",
        data: {
            hello: "Hello, world!",
            welcome: "Welcome to Vue"
        }
    });
});