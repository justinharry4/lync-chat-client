const express = require('express');

const config = require('./server/config');
const { getBase, getError } = require('./server/controllers');

const app = express();

app.set('view engine', config.viewEngine);
app.set('views', config.publicPath);

app.use(express.static(config.publicPath));
app.use(express.static(config.srcPath));

app.use('/', getBase);

app.use(getError);

app.listen(config.PORT, config.onConnection);

// app.use((req, res, next) => {
//     res.se
// })