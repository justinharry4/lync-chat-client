import view from "../../view/view.js";

class Component {
    constructor(context){
        this.ctx = context;
        
        let localContext;
        if (this.localContext){
            localContext = this.localContext();
            this.ctx = {...this.ctx, ...localContext}
        }
    }

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

    viewPromise(){
        return new Promise((resolve, reject) => {
            resolve(this.view());
        });
    }

    async render(){
        let rawViewStr = await this.viewPromise();
    
        let ltResolvedViewStr = view.insertDynamicText(rawViewStr, this.ctx);
        
        let lsAttrViewStr = view.addSvgSourceAttributes(ltResolvedViewStr);
        let lcAttrViewStr = view.addComponentAttributes(lsAttrViewStr);
        let lfAttrViewStr = view.addHandlerAttributes(lcAttrViewStr);
        
        let $componentWithSvg = await view.renderSvg(lfAttrViewStr);
        let $lightComponent = view.addEventListeners($componentWithSvg, this.ctx);
        let $fullComponent = await view.renderSubComponents($lightComponent, this);
        
        this.$element = $fullComponent;

        return this.$element;
    }
}

export default Component;