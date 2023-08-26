import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";

import './ChatBox.css';

class ChatBox extends Component {
    baseCtx = {
        chatId: null,
        chatType: null,
        headerPhotoUrl: null,
        headerTitle: null,
    }

    constructor(...args){
        super(...args);

        this.childComponents = { ChatHeader };
        this.childContexts = {
            header: {
                ...this.ctx,
                title: this.ctx.headerTitle,
                photoUrl: this.ctx.headerPhotoUrl,
            }
        };
    }

    view(){
        return `
            <section id="chatbox">
                <Component-lc lc--ChatHeader:header--cl></Component-lc>
            </section>
        `
    }
}

export default ChatBox;