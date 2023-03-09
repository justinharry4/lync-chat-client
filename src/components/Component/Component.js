import view from "../../view/view.js";

class Component {
    constructor(context){
        this.ctx = context;
    }

    render(){
        let rawViewStr = this.view();
    
        let ltResolvedViewStr = view.insertDynamicText(rawViewStr, this.ctx);
    
        let lcAttrViewStr = view.addComponentAttributes(ltResolvedViewStr)
        let lfAttrViewStr = view.addHandlerAttributes(lcAttrViewStr);
    
        let $lightComponent = view.addEventListeners(lfAttrViewStr, this.ctx);
        let $fullComponent = view.renderSubComponents($lightComponent, this);
    
        return $fullComponent;
    }
}

export default Component;