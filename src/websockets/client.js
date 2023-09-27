import { v4 as uuidv4 } from "uuid";

import protocol from "./protocol.js";
import { TextFrame, FrameParser } from "./frames.js";
import { clientStatus, serverStatus } from "./status.js";
import { messageHandler, Dispatcher } from "./dispatch.js";
import { MessageHandlerSet, AckHandlerSet } from "./handlers.js";


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


class Registry {
    PENDING = 0;
    IN_PROGRESS = 1;
    COMPLETE = 2;

    map = new Map();

    get(key){
        return this.map.get(key);
    }

    set(key, value){
        return this.map.set(key, value);
    }

    delete(key){
        return this.map.delete(key);
    }
}


class ChatInterface {
    constructor(client){
        this.client = client;
        this.registry = new Registry();

        let handlerSetClasses = [
            MessageHandlerSet,
            AckHandlerSet,
        ];

        this.dispatcher = new Dispatcher(this, ...handlerSetClasses);
    }

    sendAck(key, serverCode, extraData){
        extraData = extraData || {};

        let data = { 'server_code': serverCode, ...extraData };
        let frame = new TextFrame(key, clientStatus.ACKNOWLEDGMENT, data);
        
        this.client.ws.send(frame.data);
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
            status: this.registry.PENDING,
            queue: fragments,
            component: component,
        };

        this.registry.set(key, initialState);
    }

    sendExtraText(key){
    }
}


export default WebSocketClient;