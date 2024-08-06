import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";
import DateRule from "../DateRule/DateRule.js";
import TextMessage from "../TextMessage/TextMessage.js";
import MessageForm from "../MessageForm/MessageForm.js";
import ChatInfoRule from "../ChatInfoRule/ChatInfoRule.js";

import { MSG_FORMATS, DELIVERY_STATUSES, getCurrentChatId } from "../../utils/utils.js";

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
            MessageForm,
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

    async postRender(){
        let app = this.app;
        let { messages, unreadCount } = await this.fetchInitialMessages();

        this.tagFirstNewMessage(messages);

        let messageContexts = this.getMessageContexts(messages);
        let $messageBox = this.$element.find('.message-box');

        for (let ctx of messageContexts){
            if (unreadCount > 0 && ctx.isTagged){
                let ruleCtx = {
                    text: unreadCount + ' UNREAD MESSAGES',
                }

                let newMsgRule = new ChatInfoRule(app, ruleCtx);
                let $newMsgRule = await newMsgRule.render(this);

                $messageBox.append($newMsgRule);
            }

            let textMessage = new TextMessage(app, ctx);
            let $textMessage = await textMessage.render(this);

            $messageBox.append($textMessage);
        }
    }

    async fetchInitialMessages(){
        let app = this.app;
        let pcId = this.ctx.chatId;
        
        let chatId = await getCurrentChatId(app, pcId);

        console.log('chatId', chatId);

        if (!chatId){
            return null;
        }

        let url = `/chat/privatechats/${pcId}/chats/${chatId}/messages/`;
        let queryParam = '?category=initial';
        let fullURL = url + queryParam;
        let response = await app.axios.get(fullURL);
        let responseData = response.data;

        let unreadCount = responseData['unread_count'];
        let messages = responseData.results;

        console.log('messages res', responseData);

        return { messages, unreadCount };
    }

    tagFirstNewMessage(messages){
        let statuses = [DELIVERY_STATUSES.SENT, DELIVERY_STATUSES.DELIVERED];

        for (let message of messages){
            let isSenderSelf = message.sender === this.app.userId;
            let isNotViewed = statuses.includes(message['delivery_status']);

            if (!isSenderSelf && isNotViewed){
                message.isTagged = true;
                break;
            }
        }

        return messages;
    }

    getMessageContexts(messages){
        let messageContexts = [];

        for (let message of messages){
            let isSenderSelf = message.sender === this.app.userId;

            let messageCtx = {
                text: message.content.text,
                timeStamp: message['time_stamp'],
                chatType: this.ctx.chatType,
                isSenderSelf: isSenderSelf,
                serverId: message.id,
                isTagged: message.isTagged,
            }

            if (isSenderSelf){
                messageCtx.status = message['delivery_status']
            }

            messageContexts.push(messageCtx);
        }

        return messageContexts;
    }

    view(){
        return `
            <section
                id="chatbox"
                lf--le-submitMessage:handleMessageSubmit|le-newChatMessage:handleNewMessage|le-status:handleMessageDeliveryStatusUpdate--fl
            >
                <Component-lc lc--ChatHeader:header--cl></Component-lc>
                <div class="message-box"></div>
                <Component-lc lc--MessageForm:msgForm--cl></Component-lc>
            </section>
        `
    }
}

export default ChatBox;