import Component from "../Component/Component.js";

import { toHourMinuteFormat, toSlashedDayMonthYearFormat } from "../../utils/utils.js"

import './MessageBanner.css';

class MessageBanner extends Component {
    baseCtx = {
        photoUrl: null,
        chatTitle: null,
        message: null,
        timeStamp: null,
        status: null,
        chatType: null,
        chatId: null,
        unreadCount: null,
    }

    constructor(...args){
        super(...args);

        this.ctx.time = toHourMinuteFormat(this.ctx.timeStamp);
        this.ctx.date = toSlashedDayMonthYearFormat(this.ctx.timeStamp);
    }

    contextMethods(){
        return [this.openChatBox];
    }

    openChatBox(e){
        let chatBoxCtx = {
            chatId: this.ctx.chatId,
            chatType: this.ctx.chatType,
            headerPhotoUrl: this.ctx.photoUrl,
            headerTitle: this.ctx.chatTitle,
        };

        let $page = $('#chat-root');

        let event = $.Event('le-openChatBox');
        event.context = { ctx: chatBoxCtx };

        $page.trigger(event);
    }

    getStatusOrCountClass(){
        let prefix = 'msg-banner__'
        let suffix;

        if (this.ctx.unreadCount > 0){
            suffix = 'msg-count';
        } else {
            suffix = 'msg-status';
        }

        return prefix + suffix;
    }

    view(){
        return `
            <div class="msg-banner" lf--click:openChatBox--fl>
                <img class="msg-banner__photo" src="${this.ctx.photoUrl}" alt="profile photo">
                <div class="msg-banner__msg-container">
                    <div class="msg-banner__name-wrapper">
                        <b>${this.ctx.chatTitle}</b>
                        <time>${this.ctx.date}&nbsp;${this.ctx.time}</time>
                    </div>
                    <div class="msg-banner__msg-wrapper">
                        <span class="msg-banner__message">${this.ctx.message}</span>
                        <span class="msg-banner__msg-${(this.ctx.unreadCount > 0) ? 'count':'status'}">
                            ${(this.ctx.unreadCount > 0) ? this.ctx.unreadCount: this.ctx.status}
                        </span>
                    </div>
                </div>
            </div>
        `
    }
}

export default MessageBanner;