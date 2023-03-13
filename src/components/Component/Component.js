import view from "../../view/view.js";

class Component {
    constructor(context){
        this.ctx = context;
    }

    async render(){
        let rawViewStr = this.view();
    
        let ltResolvedViewStr = view.insertDynamicText(rawViewStr, this.ctx);
        
        let lsAttrViewStr = view.addSvgSourceAttributes(ltResolvedViewStr);
        let lcAttrViewStr = view.addComponentAttributes(lsAttrViewStr);
        let lfAttrViewStr = view.addHandlerAttributes(lcAttrViewStr);
        
        let $componentWithSvg = await view.renderSvg(lfAttrViewStr);
        let $lightComponent = view.addEventListeners($componentWithSvg, this.ctx);
        let $fullComponent = view.renderSubComponents($lightComponent, this);
    
        return $fullComponent;
    }
}

export default Component;