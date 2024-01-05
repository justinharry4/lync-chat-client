import { get } from '../utils/utils.js';
import Component from '../components/Component/Component.js';


function insertDynamicText(rawTemplateStr, context){
    let varStartSeq = 'lt--';
    let varEndSeq = '--tl';
    let breakSeq = '\nlxl-';
 
    let templateStr = rawTemplateStr.split(varEndSeq).join(varEndSeq + breakSeq);
    
    let templateVarRe = new RegExp(varStartSeq + '.*' + varEndSeq, 'g');
    let breakRe = new RegExp(breakSeq, 'g');

    let matches = templateStr.match(templateVarRe);
    let templateVars = []
        .concat(matches)
        .filter((value) => value)
        .map((matchStr) => {
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
    let templateStr = rawTemplateStr.replace(componentTagRe, 'div');
    
    return addDataAttributes(
        templateStr,
        componentStartSeq,
        componentEndSeq,
        dataAttr
    );
}

function addSvgSourceAttributes(rawTemplateStr){
    let svgStartSeq = 'ls--';
    let svgEndSeq = '--sl';
    let dataAttr = 'ls';

    let svgTagRe= new RegExp('Svg-ls', 'g');
    let templateStr = rawTemplateStr.replace(svgTagRe, 'svg');

    return addDataAttributes(
        templateStr,
        svgStartSeq,
        svgEndSeq,
        dataAttr
    );
}

async function renderSvg(templateStr){
    let $element = $(templateStr);
    let $container = $('<div>');
    $container.append($element);

    let $svgElements = $container.find('svg[data-ls]');
    for (let svgEl of $svgElements){
        let $svgEl = $(svgEl);

        let idAttr = $svgEl.attr('id');
        let classAttr = $svgEl.attr('class');
        let lfMarker = $svgEl.data('lf');
        let src = $svgEl.data('ls');
        
        try {
            let { resData } = await get(src);
            let $trueSvg = $(resData).find('svg');

            $trueSvg
                .addClass(classAttr)
                .attr('id', idAttr)
                .attr('data-lf', lfMarker);

            $svgEl.replaceWith($trueSvg);
        } catch ({ jqXHR }){
            console.log("Request to '" + src + "' Failed!");
        }
    }

    return $container.children();
}

function addEventListeners($element, context){
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

async function renderSubComponents($element, component){
    let $container = $('<div>');
    $container.append($element);

    let $subCmpDivs = $container.find('div[data-lc]');
    for (let subCmpDiv of $subCmpDivs){
        let childNodes = subCmpDiv.childNodes;

        let $subCmpDiv = $(subCmpDiv);
        let idAttr = $subCmpDiv.attr('id');
        let classAttr = $subCmpDiv.attr('class');

        let lcMarker = $subCmpDiv.data('lc');
        let [className, ctxName] = lcMarker.split(':');
        let cmpClass = component.childComponents[className];
        let ctx = component.childContexts[ctxName];

        let cmp = new cmpClass(ctx);
        let $cmpEl = await cmp.render();

        $cmpEl.attr('id', idAttr).addClass(classAttr);
        $cmpEl.append(childNodes);
        $subCmpDiv.replaceWith($cmpEl);
    }

    let $fullElement = $container.children();

    return $fullElement;
}

function renderRoot(page){
    let el = page.view();
    
    $('#root').append(el);
}

let view = {
    renderRoot,
    insertDynamicText,
    addComponentAttributes,
    addHandlerAttributes,
    addSvgSourceAttributes,
    renderSvg,
    addEventListeners,
    renderSubComponents,
};

// export default view;


class View {
    constructor(component){
        this.component = component;
    }

    insertDynamicText(rawTemplateStr, context){
        let varStartSeq = 'lt--';
        let varEndSeq = '--tl';
        let breakSeq = '\nlxl-';
     
        let templateStr = rawTemplateStr.split(varEndSeq).join(varEndSeq + breakSeq);
        
        let templateVarRe = new RegExp(varStartSeq + '.*' + varEndSeq, 'g');
        let breakRe = new RegExp(breakSeq, 'g');
    
        let matches = templateStr.match(templateVarRe);
        let templateVars = []
            .concat(matches)
            .filter((value) => value)
            .map((matchStr) => {
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

    addDataAttributes(rawTempStr, startSeq, endSeq, attr){
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

    addHandlerAttributes(rawTemplateStr){
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
    
    addComponentAttributes(rawTemplateStr){
        let componentStartSeq = 'lc--';
        let componentEndSeq = '--cl';
        let dataAttr = 'lc';
        
        let componentTagRe = RegExp('Component-lc', 'g');
        let templateStr = rawTemplateStr.replace(componentTagRe, 'div');
        
        return addDataAttributes(
            templateStr,
            componentStartSeq,
            componentEndSeq,
            dataAttr
        );
    }
    
    addSvgSourceAttributes(rawTemplateStr){
        let svgStartSeq = 'ls--';
        let svgEndSeq = '--sl';
        let dataAttr = 'ls';
    
        let svgTagRe= new RegExp('Svg-ls', 'g');
        let templateStr = rawTemplateStr.replace(svgTagRe, 'svg');
    
        return addDataAttributes(
            templateStr,
            svgStartSeq,
            svgEndSeq,
            dataAttr
        );
    }

    async renderSvg(templateStr){
        let $element = $(templateStr);
        let $container = $('<div>');
        $container.append($element);
    
        let $svgElements = $container.find('svg[data-ls]');
        for (let svgEl of $svgElements){
            let $svgEl = $(svgEl);
    
            let idAttr = $svgEl.attr('id');
            let classAttr = $svgEl.attr('class');
            let lfMarker = $svgEl.data('lf');
            let src = $svgEl.data('ls');
            
            try {
                let { resData } = await get(src);
                let $trueSvg = $(resData).find('svg');
    
                $trueSvg
                    .addClass(classAttr)
                    .attr('id', idAttr)
                    .attr('data-lf', lfMarker);
    
                $svgEl.replaceWith($trueSvg);
            } catch (error){
                if (error.jqXHR){
                    console.log("Request to '" + src + "' Failed!");
                    console.log(error.jqXHR);
                } else {
                    console.log(error);
                }
            }
        }
    
        return $container.children();
    }
    
    addEventListeners($element, context){
        function attachListeners(el){
            let $el = $(el);
            let lfMarker = $el.data('lf');
    
            if (lfMarker){
                let lfPairs = lfMarker.split('|');

                for (let lfPair of lfPairs){
                    let [ event, fnName ] = lfPair.split(':');
    
                    if ((typeof context[fnName]) !== 'function' ){
                        throw new Error('invalid lf marker ' + lfMarker + ' on ', el);
                    }
        
                    $el.on(event, context[fnName]);
                    $el.removeAttr('data-lf');
                }
            }
    
            for (let childEl of $el.children()){
                attachListeners(childEl);
            }
        }
    
        attachListeners($element);
        
        return $element;
    }
    
    async renderSubComponents($element, component){
        let $container = $('<div>');
        $container.append($element);
        
        let $subCmpDivs = $container.find('div[data-lc]');
        for (let subCmpDiv of $subCmpDivs){
            let childNodes = subCmpDiv.childNodes;
            
            let $subCmpDiv = $(subCmpDiv);
            let idAttr = $subCmpDiv.attr('id');
            let classAttr = $subCmpDiv.attr('class');
    
            let lcMarker = $subCmpDiv.data('lc');
            let [className, ctxName] = lcMarker.split(':');
            let cmpClass = component.childComponents[className];
            let ctx = component.childContexts[ctxName];
            let app = component.app;
            
            let cmp = new cmpClass(app, ctx);

            let $cmpEl = await cmp.render(component);
            
            $cmpEl.attr('id', idAttr).addClass(classAttr);
            $cmpEl.append(childNodes);
            $subCmpDiv.replaceWith($cmpEl);
        }
    
        let $fullElement = $container.children();
    
        return $fullElement;
    }

    addComponentToTree(ref, parent){
        if (parent){
            let refTree = ref.tree;
            let parentTree = parent.tree;
    
            parentTree.addChild(ref);
            refTree.setParent(parent);
        }
    }

    async createElement(parent){
        let cmp = this.component;

        let rawViewStr = await cmp.viewPromise();

        let ltResolvedViewStr = this.insertDynamicText(rawViewStr, cmp.ctx);
        let lsAttrViewStr = this.addSvgSourceAttributes(ltResolvedViewStr);
        let lcAttrViewStr = this.addComponentAttributes(lsAttrViewStr);
        let lfAttrViewStr = this.addHandlerAttributes(lcAttrViewStr);
        
        let $componentWithSvg = await this.renderSvg(lfAttrViewStr);
        let $lightComponent = this.addEventListeners($componentWithSvg, cmp.ctx);

        // console.log(cmp);
        this.addComponentToTree(cmp, parent);

        let $fullComponent = await this.renderSubComponents($lightComponent, cmp);

        return $fullComponent;
    }
}

export default View;