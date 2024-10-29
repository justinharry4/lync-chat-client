import Component from "../Component/Component.js";
import IconButton from "../IconButton/IconButton.js";

import { toHourMinuteFormat } from "../../utils/utils.js";

import './TextMessage.css';


let optionsIconURL = new URL(
    '../../../public/images/svg/more.svg',
    import.meta.url
);

class TextMessage extends Component {
    baseCtx = {
        text: null,
        timeStamp: null, // isostring
        senderName: null, // gc
        photoUrl: null, // gc
        status: null, // self
        chatType: null,
        isSenderSelf: null,
        serverId: null,
        isBlank: null,
        isTop: null,
        isBottom: null,
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

        if (this.ctx.isBlank){
            this.ctx.text = '';
            this.ctx.timeStamp = '';
            this.ctx.status = '';
        } else {
            this.ctx.timeStamp = toHourMinuteFormat(this.ctx.timeStamp);
        }
    }

    displayOptions(e){
    }

    updateDeliveryStatus(status){
        let $status = this.$element.find('.text-message__status');

        $status.text(status);
        this.ctx.status = status;
    }

    setId(id){
        if (!this.ctx.serverId){
            this.ctx.serverId = id;
        }
    }

    setTimeStamp(date){
        if (!this.ctx.timeStamp){
            let time = toHourMinuteFormat(date);
            let $time = this.$element.find('.text-message__time-wrapper time');

            $time.text(time);
            this.ctx.timeStamp = date;
        }
    }

    getScrollAction(){
        if (this.ctx.isTop){
            // check if blank is in view
        } else if (this.ctx.isBottom){
            // check if blank is in view
        }

        return { next: false , prev: false };
    }

    view(){
        let class1 = 'text-message';
        let class2 = (this.ctx.isSenderSelf) ? 'self': 'other';
        let class3 = (this.ctx.isBlank) ? 'blank': '';
        let classStr = `${class1} ${class2} ${class3}`

        return `
            <div class="${classStr}">
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