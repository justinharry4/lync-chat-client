import Component from "../Component/component.js";

import './MessageBanner.css';

class MessageBanner extends Component {
    baseCtx = {
        photoUrl: null,
        chatTitle: null,
        message: null,
        messageTime: null,
        status: null,
        chatType: null,
        chatId: null,
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
        console.log('triggered');
    }

    view(){
        return `
            <div class="msg-banner" lf--click:openChatBox--fl>
                <img class="msg-banner__photo" src="lt--photoUrl--tl" alt="profile photo">
                <div class="msg-banner__msg-container">
                    <div class="msg-banner__name-wrapper">
                        <b>lt--chatTitle--tl</b>
                        <time>lt--messageTime--tl</time>
                    </div>
                    <div class="msg-banner__msg-wrapper">
                        <span class="msg-banner__message">lt--message--tl</span>
                        <span class="msg-banner__msg-status">lt--status--tl</span>
                    </div>
                </div>
            </div>
        `
    }
}

export default MessageBanner;