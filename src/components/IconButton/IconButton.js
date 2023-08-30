import Component from "../Component/Component.js";
import Button from "../Button/Button.js";

import './IconButton.css';

class IconButton extends Component {
    baseCtx = {
        iconLink: '',
        onClick: null,
        type: 'button',
    }

    constructor(...args){
        super(...args);

        this.childComponents = { Button };
        this.childContexts = {
            btn: {
                type: this.ctx.type,
                onClick: this.ctx.onClick,
                labelText: '',
            },
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