import Component from "../Component/Component.js";
import IconButton from "../IconButton/IconButton.js";

import './TextMessage.css';


let optionsIconURL = new URL(
    '../../../public/images/svg/more.svg',
    import.meta.url
);

class TextMessage extends Component {
    baseCtx = {
        text: null,
        timeStamp: null,
        senderName: null, // gc
        photoUrl: null, // gc
        status: null, // self
        chatType: null,
        isSenderSelf: null
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
        console.log('displaying message options...');
    }

    view(){
        return `
            <div class="text-message ${(this.ctx.isSenderSelf) ? 'self': 'other'}">
                ${(this.ctx.chatType == 'GC') ? `
                    <div class="text-message__photo-wrapper">
                        <img src="${this.ctx.photoUrl}" alt="">
                    </div>
                `: ''
                }
                <div class="text-message__body-wrapper">
                    ${(this.ctx.chatType == 'GC') ? `
                        <div class="text-message__sender">${this.ctx.senderName}</div>
                    `: ''
                    }
                    <div class="text-message__options-wrapper">
                        <div class="text-message__text-wrapper">
                            <span>${this.ctx.text}</span>
                            <div class="text-message__time-wrapper">
                                <time>${this.ctx.timeStamp}</time>
                                ${(this.ctx.isSenderSelf) ? `
                                    <span class="text-message__status">${this.ctx.status}</span>
                                `: ''
                                }
                            </div>
                        </div>
                        <Component-lc lc--IconButton:options--cl></Component-lc>
                    </div>
                </div>
            </div>
        `
    }
}

export default TextMessage;