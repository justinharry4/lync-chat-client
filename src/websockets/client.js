import { v4 as uuidv4 } from "uuid";

import { TextFrame, FrameParser } from "./frames.js";
import { clientStatus, serverStatus } from "./status.js";
import { messageHandler, Dispatcher } from "./dispatch.js";
import protocol from "./protocol.js";

// message delivery statuses (interface registry)
const RGS_PENDING = 0;
const RGS_IN_PROGRESS = 1;
const RGS_COMPLETE = 2;

// message delivery statuses (component)
const MSG_IN_PROGRESS = 'P';
const MSG_SENT = 'S';
const MSG_DELIVERED = 'D';
const MSG_VIEWED = 'V';


class WebSocketClient {
    constructor(url){   
        this.url = url;

        this.binaryType = 'arraybuffer';
        this.ws = new WebSocket(url);
        this.ws.binaryType = this.binaryType;
        
        this.attachHandlers(this.ws);

        this.chat = new ChatInterface(this);
    }

    attachHandlers(ws){
        ws.addEventListener('open', this.handleConnect);
        ws.addEventListener('close', this.handleClose);
        ws.addEventListener('message', this.handleMessage);
    }

    reconnect(){
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = this.binaryType;

        this.attachHandlers(this.ws);
    }

    handleConnect = (event) => {
        console.log('socket connected');

        let enc = new TextEncoder();
        let token = localStorage.getItem('accessToken');
        let header = 'JWT ' + token;
        let authData = { [protocol.AUTH_KEY]: header };
        let message = enc.encode(JSON.stringify(authData));

        this.ws.send(message);
    }
    
    handleClose(event){
        console.log('socket closed');
    }
    
    handleMessage = (event) => {
        console.log('socket message recieved');
        
        let rawData = new Uint8Array(event.data);
        let parser = new FrameParser(rawData);
        let message = parser.parse();
    
        this.chat.dispatcher.dispatch(message);
    }

    sendText(...args){
        return this.chat.sendText(...args);
    }
}


class ChatInterface {
    constructor(client){
        this.client = client;
        this.registry = new Map();
        this.dispatcher = new Dispatcher(this);
    }

    sendText(text, chatId, component){
        let key = uuidv4();
        
        let fragments = TextFrame.getFragments(text);
        let headText = fragments.shift();

        let data = {
            'chat_id': chatId,
            'content_format': 'TXT',
            'content': headText,
        };

        let statusCode;
        if (fragments.length > 0){
            statusCode = clientStatus.HEAD_TEXT_MCE;
        } else {
            statusCode = clientStatus.HEAD_TEXT_EOC;
        }

        let frame = new TextFrame(key, statusCode, data);

        // let dec = new TextDecoder('utf-8');
        // console.log(frame.data, dec.decode(frame.data));

        this.client.ws.send(frame.data);

        let initialState = {
            status: RGS_PENDING,
            queue: fragments,
            component: component,
        };

        this.registry.set(key, initialState);
    }

    sendExtraText(key){
    }
    
    handleSendTextAck = messageHandler(
        (key, statusCode, messageBody) => {
            console.log('acknowledgement recieved');

            let clientCode = messageBody['client_code'];
            let contentDigit = String(clientCode)[1];
            let entry = this.registry.get(key);

            if (contentDigit == protocol.EOC_DIGIT){
                entry.component.updateDeliveryStatus(MSG_SENT);
                this.registry.delete(key);
            } else if (contentDigit == protocol.MCE_DIGIT){
                entry.status = RGS_IN_PROGRESS;
                this.sendExtraText(key);
            }
        },
        [serverStatus.ACKNOWLEDGMENT]
    )

    handleTextData = messageHandler(
        (key, statusCode, messageBody) => {
            console.log('message recieved');
            console.log(key, statusCode, messageBody);
        },
        [serverStatus.HEAD_TEXT_EOC, serverStatus.HEAD_TEXT_MCE]
    )
}


export default WebSocketClient;