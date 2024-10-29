import Component from "../Component/Component.js";
import IconButton from "../IconButton/IconButton.js";

import './ChatHeader.css';

let optionsIconURL = new URL(
    '../../../public/images/svg/more.svg',
    import.meta.url,
)

class ChatHeader extends Component {
    baseCtx = {
        title: null,
        photoUrl: null,
        chatType: null,
        chatId: null
    }

    constructor(...args){
        super(...args);

        this.childComponents = { IconButton };
        this.childContexts = {
            options: {
                iconLink: optionsIconURL,
                onClick: this.displayOptions,
                type: 'button',
            }
        }
    }

    displayOptions(e){
    }

    view(){
        return `
            <div class="chat-header">
                <img class="chat-header__photo" src="lt--photoUrl--tl" alt="chat photo">
                <div class="chat-header__title-wrapper">
                    <h3 class="chat-header__title">lt--title--tl</h3>
                    <div class="chat-header__status"></div>
                </div>
                <div class="chat-header__options">
                    <Component-lc lc--IconButton:options--cl></Component-lc>
                </div>
            </div>
        `
    }
}

export default ChatHeader;