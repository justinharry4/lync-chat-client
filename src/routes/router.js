import Chat from '../pages/Chat/Chat.js';
import Error404 from '../pages/Error404/Error404.js';


const redirectInvalidUrls = true;

const defaultUrl = '/chat';

const error404Url = '/pagenotfound';

const urlMap = {
    '/chat': Chat,
};

urlMap[error404Url] = Error404;

function getPage(url){
    let pageClass, redirected, notFound;

    if (Object.keys(urlMap).includes(url)){
        pageClass = urlMap[url];
    } else {
        if (redirectInvalidUrls){
            pageClass = urlMap[defaultUrl];
            redirected = true;
        } else {
            pageClass = urlMap[error404Url];
            notFound = true;
        }
    }

    return { pageClass, redirected, notFound };
}

function renderPage(url){
    let { pageClass, redirected, notFound } = getPage(url);

    if (redirected) {
        history.replaceState(null, null, defaultUrl);
    } else if (notFound){
        history.replaceState(null, null, error404Url);
    }
    
    let page = new pageClass();
    page.renderPage();
}

let router = { renderPage };

export default router;