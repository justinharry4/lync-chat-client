function insertDynamicText(rawTemplateStr, context){
    let varStartSeq = 'lt--';
    let varEndSeq = '--tl';
    let breakSeq = '\nlxl-';
 
    let templateStr = rawTemplateStr.split(varEndSeq).join(varEndSeq + breakSeq);
    
    let templateVarRe = new RegExp(varStartSeq + '.*' + varEndSeq, 'g');
    let breakRe = new RegExp(breakSeq, 'g');

    let matches = templateStr.match(templateVarRe);
    let templateVars = matches.map((matchStr) => {
        return matchStr.replace(varStartSeq, '').replace(varEndSeq, '');
    });
    templateVars = [...(new Set(templateVars))];

    let varMap = {};
    for (let templateVar of templateVars){
        if (context[templateVar] === undefined){
            throw new Error(
                "No variable name '" +
                templateVar +
                "' in context object"
            );
        }

        if (typeof context[templateVar] === 'function'){
            varMap[templateVar] = context[templateVar]();
        } else {
            varMap[templateVar] = context[templateVar];
        }
    }

    for (let varName in varMap){
        let varRe = new RegExp(varStartSeq + varName + varEndSeq, 'g')
        templateStr = templateStr.replace(varRe, varMap[varName]);
    }
    
    let fixedTemplateStr = templateStr.replace(breakRe, '');

    return fixedTemplateStr;
}

function addDataAttributes(rawTempStr, startSeq, endSeq, attr){
    let breakSeq = '\nlxl';

    let templateLines = rawTempStr
        .split(endSeq)
        .join(endSeq + breakSeq)
        .split(breakSeq);

    let varRe = new RegExp(startSeq + '.*' + endSeq, 'g');
    
    let fixedTemplateLines = [];
    for (let line of templateLines){
        let fixedLine = line;

        let matches = line.match(varRe);
        if (matches){
            let varStr = matches[0]
                .replace(startSeq, '')
                .replace(endSeq, '');

            fixedLine = line.replace(varRe, `data-${attr}="${varStr}"`);
        }

        fixedTemplateLines.push(fixedLine);
    }

    let fixedTemplateStr = fixedTemplateLines.join('');

    return fixedTemplateStr;
}

function addHandlerAttributes(rawTemplateStr){
    let handlerStartSeq = 'lf--';
    let handlerEndSeq = '--fl';
    let dataAttr = 'lf';
    
    return addDataAttributes(
        rawTemplateStr,
        handlerStartSeq,
        handlerEndSeq,
        dataAttr
    );
}

function addComponentAttributes(rawTemplateStr){
    let componentStartSeq = 'lc--';
    let componentEndSeq = '--cl';
    let dataAttr = 'lc';
    
    let componentTagRe = RegExp('Component-lc', 'g');
    let templateStr = rawTemplateStr.replace(componentTagRe, 'div')
    
    return addDataAttributes(
        templateStr,
        componentStartSeq,
        componentEndSeq,
        dataAttr
    );
}

function addEventListeners(templateStr, context){
    let $element = $(templateStr);

    function attachListeners(el){
        let $el = $(el);
        let lfMarker = $el.data('lf');

        if (lfMarker){
            let [ event, fnName ] = lfMarker.split(':');
            
            if ((typeof context[fnName]) !== 'function' ){
                throw new Error('invalid lf marker ' + lfMarker + ' on ' + el);
            }

            $el.on(event, context[fnName]);
            $el.removeAttr('data-lf');
        }

        for (let childEl of $el.children()){
            attachListeners(childEl);
        }
    }

    attachListeners($element);
    
    return $element;
}

function renderSubComponents($element, component){
    let $container = $('<div>');
    $container.append($element);

    let $subCmpDivs = $container.find('div[data-lc]');
    for (let subCmpDiv of $subCmpDivs){
        let childNodes = subCmpDiv.childNodes;

        let $subCmpDiv =$(subCmpDiv);
        let idAttr = $subCmpDiv.attr('id');
        let classAttr = $subCmpDiv.attr('class');

        let lcMarker = $subCmpDiv.data('lc');
        let [className, ctxName] = lcMarker.split(':');
        let cmpClass = component.childComponents[className];
        let ctx = component.childContexts[ctxName];

        let cmp = new cmpClass(ctx);
        let $cmpEl = cmp.render();

        $cmpEl.attr('id', idAttr).addClass(classAttr);
        $cmpEl.append(childNodes);
        $subCmpDiv.replaceWith($cmpEl);
    }

    let $fullElement = $container.children();

    return $fullElement;
}

// let t = `
//     <button type="button" lf--click:onClick--fl>
//         labelText
//     <div lf--blur:blurFn--fl>a random div</div><span lf--Download:showNotification--fl>some text</span>
//     </button>
// `
// let ctx = {
//     onClick: () => {console.log('clickety!')},
//     blurFn: () => {console.log('blurred out!')},
//     showNotification: () => {console.log('notified!')}
// }

// let a = addHandlerAttributes(t)
// addEventListeners(a, ctx);


function renderRoot(page){
    let el = page.view();
    
    $('#root').append(el);
}

let view = {
    renderRoot,
    insertDynamicText,
    addComponentAttributes,
    addHandlerAttributes,
    addEventListeners,
    renderSubComponents,
};

export default view;