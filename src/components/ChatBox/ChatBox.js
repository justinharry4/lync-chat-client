import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";
import DateRule from "../DateRule/DateRule.js";
import TextMessage from "../TextMessage/TextMessage.js";
import MessageForm from "../MessageForm/MessageForm.js";

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

        this.childComponents = { 
            ChatHeader,
            DateRule,
            MessageForm,
            TextMessage,
        };
        this.childContexts = {
            header: {
                ...this.ctx,
                title: this.ctx.headerTitle,
                photoUrl: this.ctx.headerPhotoUrl,
            }, 
            msgForm: {
                chatId: this.ctx.chatId,
                chatType: this.ctx.chatType,
            },
            message: {
                senderName: this.ctx.headerTitle, 
                photoUrl: this.ctx.headerPhotoUrl,
                text: 'Hi there! How are you?',
                timeStamp: '18:29',
                status: 'D',
                chatType: 'PC',
                isSenderSelf: false,
            }
        };
    }

    view(){
        return `
            <section id="chatbox">
                <Component-lc lc--ChatHeader:header--cl></Component-lc>
                <div class="message-box">
                    <Component-lc lc--DateRule:date--cl></Component-lc>
                    <Component-lc lc--TextMessage:message--cl></Component-lc>
                </div>
                <Component-lc lc--MessageForm:msgForm--cl></Component-lc>
            </section>
        `
    }
}

export default ChatBox;