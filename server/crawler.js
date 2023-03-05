const fs = require('fs');
const path = require('path');

const { srcPath } = require('./config');

function crawl(rootDir, extension, targetFiles=[]){
    let entries = fs.readdirSync(rootDir).map(entry => {
        return path.join(rootDir, entry);
    });

    for (let entry of entries){
        if (fs.lstatSync(entry).isDirectory()){
            crawl(entry, extension, targetFiles)
        } else {
            if (path.extname(entry) === '.' + extension){
                targetFiles.push(entry);
            }
        }
    }

    return targetFiles;
}

module.exports.getStyleSheetUrls = () => {
    let cssPaths = crawl(srcPath, 'css');

    let browserPaths = cssPaths.map(rawPath => {
        let re = new RegExp('\\\\', 'g');
        let fixedPath = rawPath.replace(re, '/');
        let browserPath = '/' + fixedPath.split('/src/').slice(-1)[0];
        
        return browserPath;
    });

    return browserPaths;
}   

