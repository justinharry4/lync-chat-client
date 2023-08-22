import Component from "../Component/Component.js";

import './Button.css';

class Button extends Component {
    baseCtx = {
        type: 'button',
        labelText: 'Button',
        onClick: null,
    }

    view(){
        return `
            <button type="lt--type--tl" lf--click:onClick--fl>
                <span>lt--labelText--tl</span>
            </button>
        `
    }
}

export default Button;