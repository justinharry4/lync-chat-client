import Component from "../Component/Component.js";

import './Input.css';

class Input extends Component {
    baseCtx = {
        labelText: '',
        type: '',
        name: '',
        value: '',
        onFocus: null,
        onBlur: null,
    }

    view(){
        return `
            <input 
                type="lt--type--tl"
                name="lt--name--tl"
                value="lt--value--tl"
                placeholder="lt--labelText--tl"
                lf--focus:onFocus|blur:onBlur--fl
            >
        `
    }
}

export default Input;