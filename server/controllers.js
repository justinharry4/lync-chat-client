const path = require('path');

const { getStyleSheetUrls } = require('./crawler');

module.exports.getBase = async (req, res, next) => {
    console.log('getting base...');

    res.render('index', {
        url: req.path,
        stylesheetUrls: getStyleSheetUrls(),
    });
}

module.exports.getError = (err, req, res, next) => {
    let errorFilePath = path.join(process.cwd(), 'public', 'error.html');

    res.sendFile(errorFilePath);
}
