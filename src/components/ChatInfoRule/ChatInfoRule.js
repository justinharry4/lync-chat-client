import Component from "../Component/Component.js";

import './ChatInfoRule.css';


class ChatInfoRule extends Component {
    baseCtx = {
        text: null,
    }

    view(){
        return `
            <div class="chatinfo-rule">
                <hr>
                <span>${this.ctx.text}</span>
            </div>
        `
    }
}

export default ChatInfoRule;