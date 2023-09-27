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
        isSenderSelf: null,
        serverId: null,
    }

    constructor(...args){
        super(...args);

        this.ctx.timeStamp = this.formatTimeStamp(this.ctx.timeStamp);

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

    formatTimeStamp(date){
        let newDate = new Date(date);

        if (isNaN(newDate.valueOf())){
            return '';
        }

        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        
        let formatNumber = (num) => (num < 10) ? ('0' + num): num;
        let formatedHours = formatNumber(hours);
        let formatedMins = formatNumber(minutes);

        let timeStr = formatedHours + ':' + formatedMins;
        return timeStr;
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
            let time = this.formatTimeStamp(date);
            let $time = this.$element.find('.text-message__time-wrapper time');

            $time.text(time);
            this.ctx.timeStamp = date;
        }
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