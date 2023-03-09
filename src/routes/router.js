import view from '../view/view.js';
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
    let page, redirected, notFound;
    if (Object.keys(urlMap).includes(url)){
        page = urlMap[url];
    } else {
        if (redirectInvalidUrls){
            page = urlMap[defaultUrl];
            redirected = true;
        } else {
            page = urlMap[error404Url];
            notFound = true;
        }
    }

    return { page, redirected, notFound };
}

function renderPage(url){
    let {page, redirected, notFound } = getPage(url);

    if (redirected) {
        history.replaceState(null, null, defaultUrl);
    } else if (notFound){
        history.replaceState(null, null, error404Url);
    }
    
    view.renderRoot(new page());
}

let router = { renderPage };

export default router;