import Component from "../Component/Component.js";
import Button from "../Button/Button.js";

class IconButton extends Component {
    baseCtx = {
        iconLink: '',
        onClick: null,
    }

    constructor(context){
        super(context);

        this.childComponents = { Button };
        this.childContexts = {
            btn: { labelText: '', onClick: this.ctx.onClick },
        }
    }

    view(){
        return `
            <Component-lc lc--Button:btn--cl class="iconbtn">
                <Svg-ls ls--lt--iconLink--tl--sl>
                </Svg-ls>
            </Component-lc>
        `
    }
}

export default IconButton;