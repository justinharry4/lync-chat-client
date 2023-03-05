const path = require('path');

module.exports.viewEngine = 'ejs';

module.exports.publicPath = path.join(process.cwd(), 'public');

module.exports.srcPath = path.join(process.cwd(), 'src');

module.exports.PORT = 4040;

module.exports.onConnection = () => {
    console.log('server running on port ' + exports.PORT);
}
