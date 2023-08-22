import View from "../../view/view.js";

class Component {
    constructor(app, context){
        this.app = app;
        this.ctx = context;
        this.state = {};
        
        this.extendContext();
    }

    extendContext(){
        let extension = {}
        if (this.contextMethods){
            for (let method of this.contextMethods()){
                extension[method.name] = method.bind(this);
            }
        }

        this.ctx = {...this.ctx, ...extension};
    }

    async generateChildContexts(){}

    iterStr(iterable, fn, mode='o'){
        // modes: o => for of, i => for in, e => for each
        let templateStr = '';

        if (mode === 'o'){
            for (let entry of iterable){
                templateStr += fn(entry, iterable) + '\n';
            }
        }

        return templateStr;
    }

    autoSubCompIterStr(prefix, fn){
        let iterable = this.getChildContextGroupNames(prefix);

        return this.iterStr(iterable, fn);
    }

    addChildContextGroup(prefix, arr){
        let contextGroup = {};
        for (let [idx, entry] of arr.entries()){
            let propName = prefix + '_' + idx;
            contextGroup[propName] = entry;
        }

        this.childContexts = { ...this.childContexts, ...contextGroup };
    }

    getChildContextGroupNames(prefix){
        let propNames = [];

        for (let propName in this.childContexts){
            let [frag1, frag2] = propName.split('_');
            if (frag1 === prefix && !isNaN(frag2)){
                propNames.push(propName);
            }
        }

        return propNames;
    }

    changeState(obj){
        this.state = {...this.state, ...obj};
        this.refresh();
    }

    async refresh(){
        let $oldElement = this.$element;

        let $newElement = await this.render();
        // console.log('new', $newElement.parent());
        // console.log('old', $oldElement);
        // console.log('new', $newElement);
        $oldElement.replaceWith($newElement);

        // this.$element = $newElement;
    }

    viewPromise(){
        return new Promise((resolve, reject) => {
            resolve(this.view());
        });
    }

    async render(){
        await this.generateChildContexts();
        
        // let rawViewStr = await this.viewPromise();

        // let ltResolvedViewStr = view.insertDynamicText(rawViewStr, this.ctx);
        // let lsAttrViewStr = view.addSvgSourceAttributes(ltResolvedViewStr);
        // let lcAttrViewStr = view.addComponentAttributes(lsAttrViewStr);
        // let lfAttrViewStr = view.addHandlerAttributes(lcAttrViewStr);
        
        // let $componentWithSvg = await view.renderSvg(lfAttrViewStr);
        // let $lightComponent = view.addEventListeners($componentWithSvg, this.ctx);
        // let $fullComponent = await view.renderSubComponents($lightComponent, this);

        let view = new View(this);
        let $fullComponent = await view.createElement();
        
        this.$element = $fullComponent;

        return this.$element;
    }
}

export default Component;