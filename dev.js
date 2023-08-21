const bs = require("browser-sync").create();

// .init starts the server
bs.init({
    server: "./public",
    watch: "*.{html,css,js}"
});