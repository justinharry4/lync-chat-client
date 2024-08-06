import { HandlerSet, messageHandler, ackHandler } from "./dispatch.js";
import { serverStatus, clientStatus } from "./status.js";
import protocol from "./protocol.js";

import { DELIVERY_STATUSES } from "../utils/utils.js";


class MessageHandlerSet extends HandlerSet {
    handleTextData = messageHandler(
        [serverStatus.TEXT_DATA],
        (key, statusCode, messageBody) => {
            console.log('text message recieved');

            let $chatbox = $('#chatbox');
            let $messageSection = $('#msg-section');

            let chatType = messageBody['chat_type'];
            let chatId = messageBody['chat_id'];

            let event = $.Event('le-newChatMessage');
            event.context = {
                chatType: chatType,
                chatId: chatId,
                messageId: messageBody['message_id'],
                format: messageBody['content_format'],
                text: messageBody['content'],
                timeStamp: messageBody['time_stamp'],
            }

            $messageSection.trigger(event);
            
            let status = DELIVERY_STATUSES.DELIVERED;

            if ($chatbox.length != 0){
                $chatbox.trigger(event);

                let page = this.interface.client.app.page;

                for (let member of page.tree.children()){
                    if (member.type == 'ChatBox'){
                        let chatbox = member.cmp;
                        
                        if (chatbox.ctx.chatId == chatId &&
                            chatbox.ctx.chatType == chatType)
                        {
                            status = DELIVERY_STATUSES.VIEWED;
                        }
                        break;
                    }
                }
            }

            let ackData = {'delivery_status': status};
            this.interface.sendAck(key, statusCode, ackData);
        }
    )

    handleMessageStatusData = messageHandler(
        [serverStatus.MESSAGE_STATUS],
        (key, statusCode, messageBody) => {
            console.log('delivery status received');

            let $chatbox = $('#chatbox');

            let event = $.Event('le-status');
            event.context = {
                chatId: messageBody['chat_id'],
                chatType: messageBody['chat_type'],
                status: messageBody['delivery_status'],
                messageId: messageBody['message_id'],
            }
    
            if ($chatbox.length != 0){
                $chatbox.trigger(event);
            }
        }
    )
}


class AckHandlerSet extends HandlerSet {
    ackTextSend = ackHandler(
    [clientStatus.TEXT_DATA],
    (key, statusCode, messageBody) => {
        console.log('acknowledgement recieved text');
        
        let chat = this.interface;
        let entry = chat.registry.get(key);
        let messageId = messageBody['message_id'];
        let timeStamp = messageBody['time_stamp'];

        entry.component.updateDeliveryStatus(DELIVERY_STATUSES.SENT);
        entry.component.setTimeStamp(timeStamp);
        entry.component.setId(messageId);

        chat.registry.delete(key);
    }
    )
}


export { MessageHandlerSet, AckHandlerSet }