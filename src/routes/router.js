import Chat from '../pages/Chat/Chat.js';
import Login from '../pages/Login/Login.js';
import SignUp from '../pages/SignUp/SignUp.js';
import Error404 from '../pages/Error404/Error404.js';


const redirectInvalidUrls = true;

const defaultUrl = '/chat';

const homeUrl = '/login';

const error404Url = '/pagenotfound';

const urlMap = {
    '/chat': Chat,
    '/login': Login,
    '/signup': SignUp,
    [error404Url]: Error404,
};

const safePages = [Error404, Login, SignUp]


class Router {
    constructor(app){
        this.app = app;
    }

    trimUrl(url){
        let trail = '/'

        if (url.endsWith(trail)){
            return url.slice(0, -1);
        }
        return url
    }

    async getPage(url){
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

        let accessDenied;
        await this.app.initialize();

        if (!this.app.isAuth && !safePages.includes(pageClass)){
            pageClass = urlMap[homeUrl]
            accessDenied = true;
        }
    
        return { pageClass, redirected, notFound, accessDenied };
    }
    
    async handleUrl(url, isRedirection){
        let trimmedUrl = this.trimUrl(url);
        
        let pageInfo = await this.getPage(trimmedUrl);
        let { pageClass, redirected, notFound, accessDenied } = pageInfo;
        
        if (accessDenied){
            history.replaceState(null, null, homeUrl);
        } else if (redirected){
            history.replaceState(null, null, defaultUrl);
        } else if (notFound){
            history.replaceState(null, null, error404Url);
        } else if (isRedirection){
            history.replaceState(null, null, trimmedUrl);
        }
        
        let page = new pageClass(this.app);
        page.renderPage();
        // this.app.setPage(page);
    }

    async redirect(url){
        await this.handleUrl(url, true);
    }
}

export default Router;