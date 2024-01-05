import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";
import DateRule from "../DateRule/DateRule.js";
import TextMessage from "../TextMessage/TextMessage.js";
import MessageForm from "../MessageForm/MessageForm.js";

import './ChatBox.css';


const FORMAT_TEXT = 'TXT';
const FORMAT_IMAGE = 'IMG';
const FORMAT_AUDIO = 'AUD';
const FORMAT_VIDEO = 'VID';


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
        ];
    }

    async handleMessageSubmit(e){
        // let tree = this.tree;
        // console.log('ref', tree.ref);
        // console.log('parent', tree.parent());
        // console.log('kids', tree.children())

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
            if (context.format == FORMAT_TEXT){
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

    view(){
        return `
            <section
                id="chatbox"
                lf--le-submitMessage:handleMessageSubmit|le-newChatMessage:handleNewMessage--fl
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