import router from "./routes/router.js";

let url = location.pathname;

router.renderPage(url);

console.log('index_ran');
