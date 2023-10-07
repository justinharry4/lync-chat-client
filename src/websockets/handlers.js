import { HandlerSet, messageHandler, ackHandler } from "./dispatch.js";
import { serverStatus, clientStatus } from "./status.js";
import protocol from "./protocol.js";

// message delivery statuses (component)
const MSG_IN_PROGRESS = 'P';
const MSG_SENT = 'S';
const MSG_DELIVERED = 'D';
const MSG_VIEWED = 'V';


class MessageHandlerSet extends HandlerSet {
    handleTextData = messageHandler(
        [serverStatus.TEXT_DATA],
        (key, statusCode, messageBody) => {
            console.log('text message recieved');

            let $chatbox = $('#chatbox');
            let $messageSection = $('#msg-section');

            let event = $.Event('le-newChatMessage');
            event.context = {
                chatType: messageBody['chat_type'],
                chatId: messageBody['chat_id'],
                messageId: messageBody['message_id'],
                format: messageBody['content_format'],
                text: messageBody['content'],
                timeStamp: messageBody['time_stamp'],
            }

            $messageSection.trigger(event);

            if ($chatbox.length != 0){
                $chatbox.trigger(event);
            }

            this.interface.sendAck(key, statusCode);
        }
    )
}


class AckHandlerSet extends HandlerSet {
    handleTextAck = ackHandler(
    [clientStatus.TEXT_DATA],
    (key, statusCode, messageBody) => {
        console.log('acknowledgement recieved text');
        
        let chat = this.interface;
        let entry = chat.registry.get(key);
        let messageId = messageBody['message_id'];
        let timeStamp = messageBody['time_stamp'];

        entry.component.updateDeliveryStatus(MSG_SENT);
        entry.component.setTimeStamp(timeStamp);
        entry.component.setId(messageId);

        chat.registry.delete(key);
    }
    )

    // handleMCETextAck = ackHandler([
    //     clientStatus.HEAD_TEXT_MCE,
    //     clientStatus.MORE_TEXT_MCE,
    // ],
    // (key, statusCode, messageBody) => {
    //     console.log('acknowledgement recieved mce');

    //     let chat = this.interface;
    //     let entry = chat.registry.get(key);

    //     entry.status = chat.registry.IN_PROGRESS;
    //     chat.sendExtraText(key);
    // }
    // )
}


export { MessageHandlerSet, AckHandlerSet }