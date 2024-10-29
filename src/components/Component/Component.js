import View from "../../view/view.js";

class Component {
    constructor(app, context){
        this.app = app;
        this.ctx = context;
        this.state = {};
        this.tree = new ComponentTree(this);
        this.id = app.generateComponentId();
        
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

    viewPromise(){
        return new Promise((resolve, reject) => {
            resolve(this.view());
        });
    }

    async preRender(){}

    async postRender(){}

    async render(parent){
        await this.preRender()

        let view = new View(this);
        let $fullComponent = await view.createElement(parent);
        
        this.$element = $fullComponent;

        await this.postRender()
        
        return this.$element;
    }

    remove(){
        let parentMember = this.tree.parent();
        let parentCmp = parentMember.cmp;

        parentCmp.tree.removeChild(this);
        this.tree.removeParent();

        this.$element.remove();
    }

    add(childCmp, baseElement){
        // this method is used to add components, which have been previously
        // removed from the component tree, back to the tree

        childCmp.tree.setParent(this);
        this.tree.addChild(childCmp);

        let parentElement = baseElement || this.$element;
        parentElement.append(childCmp.$element);
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
            }
        }
    }

    removeParent(){
        this._parent = null;
    }

    addChild(childCmp){
        if (this.isComponent(childCmp)){
            let member = new ComponentTreeMember(childCmp);
            this._children.push(member);
        }
    }

    removeChild(childCmp){
        
        let index = this._children.findIndex((member, idx) => {
            let ret = member.cmp.id === childCmp.id;
            return ret;
        });
        
        if (index !== -1){
            let x = this._children.splice(index, 1);
        }
    }

    isComponent(cmp){
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
        if (type){
            let targetMembers = [];
            for (let member of this._children){
                if (member.type === type){
                    targetMembers.push(member);
                }
            }

            return targetMembers;
        } else {
            return this._children;
        }
    }

    descendants(type){
    }
}


class ComponentTreeMember {
    constructor(cmp){
        this.cmp = cmp;
        this.type = cmp.__proto__.constructor.name;
    }
}

export default Component;