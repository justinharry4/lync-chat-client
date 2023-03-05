let componentMap = {
    '/': '<h1>Welcome to the Lync community!</h1>'
}

function renderPage(url){
    let component = componentMap[url];

    if (!component){
        component = '<h1>Bad Enpoint Son. Try something else.</h1>'
    }

    $('#root').append($(component));
}

let router = { renderPage };

export default router;