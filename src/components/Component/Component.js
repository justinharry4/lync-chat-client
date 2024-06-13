import View from "../../view/view.js";

class Component {
    constructor(app, context){
        this.app = app;
        this.ctx = context;
        this.state = {};
        this.tree = new ComponentTree(this);
        
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

    async preRender(){}

    async postRender(){}

    async render(parent){
        await this.generateChildContexts();
        
        await this.preRender()

        let view = new View(this);
        let $fullComponent = await view.createElement(parent);
        
        this.$element = $fullComponent;

        await this.postRender()

        return this.$element;
    }
}


class ComponentTree {
    constructor(cmp){
        this.ref = new ComponentTreeMember(cmp);
        this._parent = null;
        this._children = [];
        this._descendants = [];
    }

    setParent(parentCmp){
        if (!this.parent()){
            if (this.isComponent(parentCmp)){
                this._parent = new ComponentTreeMember(parentCmp);
                // console.log('parent set', parentCmp);
            }
        }
    }

    addChild(childCmp){
        if (this.isComponent(childCmp)){
            let member = new ComponentTreeMember(childCmp);
            this._children.push(member);
        }
    }

    isComponent(cmp){
        // console.log(cmp instanceof Component);
        if (cmp instanceof Component){
            return true;
        } else {
            throw new Error(
                'parent component must be a subclass of `Component`'
            );
        }
    }

    parent(){
        return this._parent;
    }

    children(type){
        if (!type){
            return this._children;
        } else {
        }
    }

    descendants(type){
        // desc code
    }
}


class ComponentTreeMember {
    constructor(cmp){
        this.cmp = cmp;
        this.type = cmp.__proto__.constructor.name;
    }
}

export default Component;