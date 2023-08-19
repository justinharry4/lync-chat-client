import Router from "./routes/router.js";

let router = new Router();

let url = location.pathname;

router.renderPage(url);