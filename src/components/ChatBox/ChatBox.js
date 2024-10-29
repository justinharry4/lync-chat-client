import Component from "../Component/Component.js";
import ChatHeader from "../ChatHeader/ChatHeader.js";
import DateRule from "../DateRule/DateRule.js";
import TextMessage from "../TextMessage/TextMessage.js";
import MessageForm from "../MessageForm/MessageForm.js";
import ChatInfoRule from "../ChatInfoRule/ChatInfoRule.js";

import { MSG_FORMATS, DELIVERY_STATUSES, getCurrentChatId, singularOrPlural } from "../../utils/utils.js";

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

        this.topBlankMessage = null;
        this.bottomBlankMessage = null;
    }

    contextMethods(){
        return [ 
            this.handleMessageSubmit,
            this.handleNewMessage,
            this.handleMessageDeliveryStatusUpdate,
            this.handleMessageBoxScroll,
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

        // this.setOlderMessagesHook();

        this.renderTextMessages(messages, unreadCount);

        // this.setNewerMessagesHook();

        this.updateViewedMessagesDeliveryStatus();

        this.triggerViewedMessageEvent();
    }

    async fetchInitialMessages(){
        let app = this.app;
        let pcId = this.ctx.chatId;
        let chatId = await getCurrentChatId(app, pcId);

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

        return { messages, unreadCount };
    }

    tagMessages(messages){
        let statuses = [DELIVERY_STATUSES.SENT, DELIVERY_STATUSES.DELIVERED];

        let firstMessage = messages[0];
        let lastMessage = messages.slice(-1)[0];

        firstMessage.isFirst = true;
        lastMessage.isLast = true;

        for (let message of messages){
            let isSenderSelf = message.sender === this.app.userId;
            let isNotViewed = statuses.includes(message['delivery_status']);

            if (!isSenderSelf && isNotViewed){
                message.isFirstNew = true;
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
                isFirst: message.isFirst,
                isFirstNew: message.isFirstNew,
                isLast: message.isLast,
            }

            if (isSenderSelf){
                messageCtx.status = message['delivery_status']
            }

            messageContexts.push(messageCtx);
        }

        return messageContexts;
    }

    async renderTextMessages(messages, unreadCount){
        let app = this.app; 

        this.tagMessages(messages);

        let messageContexts = this.getMessageContexts(messages);
        let $messageBox = this.$element.find('.message-box');

        let $firstNewMessage;
        let $lastMessage;

        for (let ctx of messageContexts){
            if (unreadCount > 0 && ctx.isFirstNew){
                let msgText = singularOrPlural(unreadCount, 'MESSAGE', 'MESSAGES');
                let ruleCtx = {
                    text: unreadCount + ' UNREAD ' + msgText,
                }

                let newMsgRule = new ChatInfoRule(app, ruleCtx);
                let $newMsgRule = await newMsgRule.render(this);

                $messageBox.append($newMsgRule);
            }

            let textMessage = new TextMessage(app, ctx);
            let $textMessage = await textMessage.render(this);

            $messageBox.append($textMessage);

            if (ctx.isFirstNew){
                $firstNewMessage = $textMessage;
            }
            if (ctx.isLast){
                $lastMessage = $textMessage;
            }
        }

        if ($firstNewMessage){
            let firstNewEl = $firstNewMessage.get(0);
            firstNewEl.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else if ($lastMessage){
            let lastEl = $lastMessage.get(0);
            lastEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    updateViewedMessagesDeliveryStatus(){
        let app = this.app;
        let wsClient;

        if (this.ctx.chatType == 'PC'){
            wsClient = app.pcClient;
        } else if (this.ctx.chatType == 'GC'){
            wsClient = app.gcClient;
        }
        
        let status = DELIVERY_STATUSES.VIEWED;
        wsClient.sendDeliveryStatusData(this.ctx.chatId, status);
    }

    triggerViewedMessageEvent(){
        let $messageSection = $('#msg-section');

        let event = $.Event('le-viewedMessage');
        event.context = { 
            chatId: this.ctx.chatId,
            chatType: this.ctx.chatType
        };

        $messageSection.trigger(event);
    }

    handleMessageBoxScroll(e){
        let active = false;
        let interval = 5 * 1000;

        setInterval(() => {
            if (active){
            }
        }, interval)
    }

    view(){
        let le1 = 'le-submitMessage:handleMessageSubmit';
        let le2 = 'le-newChatMessage:handleNewMessage';
        let le3 = 'le-status:handleMessageDeliveryStatusUpdate';
        let lfStr = `lf--${le1}|${le2}|${le3}--fl`

        return `
            <section
                id="chatbox"
                ${lfStr}
            >
                <Component-lc lc--ChatHeader:header--cl></Component-lc>
                <div class="message-box" lf--scroll:handleMessageBoxScroll--fl></div>
                <Component-lc lc--MessageForm:msgForm--cl></Component-lc>
            </section>
        `
    }

}

export default ChatBox;