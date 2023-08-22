import App from "./app.js";

let app = new App();

let url = location.pathname;

app.router.handleUrl(url);