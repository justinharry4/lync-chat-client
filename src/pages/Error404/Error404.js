import Page from '../Page/Page.js';

class Error404 extends Page {
    view(){
        return '<div id="404-container">This is the 404 error page</div>'
    }
}

export default Error404;