import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";
import DateRule from "../DateRule/DateRule.js";
import TextMessage from "../TextMessage/TextMessage.js";
import MessageForm from "../MessageForm/MessageForm.js";

import { MSG_FORMATS } from "../../utils/utils.js";

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
            }
        };
    }

    contextMethods(){
        return [ 
            this.handleMessageSubmit,
            this.handleNewMessage,
            this.handleMessageDeliveryStatusUpdate,
        ];
    }

    async handleMessageSubmit(e){
        let app = this.app;

        let text = e.context.text;
        let messageCtx = {
            text: text,
            timeStamp: '',
            status: 'P',
            chatType: this.ctx.chatType,
            isSenderSelf: true,
        };

        let textMessage = new TextMessage(this.app, messageCtx);
        let $textMessage = await textMessage.render(this);
        
        this.displayNewMessage($textMessage);

        let wsClient;
        if (this.ctx.chatType == 'PC'){
            wsClient = app.pcClient;
        } else if (this.ctx.chatType == 'GC'){
            wsClient = app.gcClient;
        }

        let chatId = this.ctx.chatId;
        wsClient.sendText(text, chatId, textMessage);
    }

    async handleNewMessage(e){
        let context = e.context;
        
        if (context.chatType == this.ctx.chatType &&
            context.chatId == this.ctx.chatId)
        {
            if (context.format == MSG_FORMATS.TEXT){
                let messageCtx = {
                    text: context.text,
                    timeStamp: context.timeStamp,
                    chatType: context.chatType,
                    isSenderSelf: false,
                    serverId: context.messageId,
                }
    
                let textMessage = new TextMessage(this.app, messageCtx);
                let $textMessage = await textMessage.render(this);

                this.displayNewMessage($textMessage);
                console.log('new message displayed');
            }
        }
    }

    displayNewMessage($message){
        let $chatbox = this.$element;
        let $messageBox = $chatbox.find('.message-box');

        $messageBox.append($message);
    }

    handleMessageDeliveryStatusUpdate(e){
        let context = e.context;

        if (context.chatType == this.ctx.chatType &&
            context.chatId == this.ctx.chatId)
        {
            let tree = this.tree;
            for (let member of tree.children()){
                if (member.type == 'TextMessage'){
                    let textMessage = member.cmp;
    
                    if (textMessage.ctx.serverId == context.messageId){
                        textMessage.updateDeliveryStatus(context.status);
                        break;
                    }
                }
            }
        }
    }

    view(){
        return `
            <section
                id="chatbox"
                lf--le-submitMessage:handleMessageSubmit|le-newChatMessage:handleNewMessage|le-status:handleMessageDeliveryStatusUpdate--fl
            >
                <Component-lc lc--ChatHeader:header--cl></Component-lc>
                <div class="message-box">
                    <Component-lc lc--DateRule:date--cl></Component-lc>
                </div>
                <Component-lc lc--MessageForm:msgForm--cl></Component-lc>
            </section>
        `
    }
}

export default ChatBox;