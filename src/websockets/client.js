import { v4 as uuidv4 } from "uuid";

import { TextFrame, FrameParser } from "./frames.js";
import { clientStatus, serverStatus } from "./status.js";
import { messageHandler, Dispatcher } from "./dispatch.js";


const PENDING = 0;
const IN_PROGRESS = 1;
const COMPLETE = 2;


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

    handleConnect(event){
        console.log('socket connected');
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
            'parent_id': chatId,
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
            status: PENDING,
            queue: fragments,
            component: component,
        };

        this.registry.set(key, initialState);
    }
    
    handleAcknowledgement = messageHandler(
        (key, statusCode, messageBody) => {
            console.log('acknowledgement recieved');
        },
        [serverStatus.ACKNOWLEDGMENT]
    )
}


export default WebSocketClient;


// let ws = new WebSocketClient();
// ws.sendText({text: 'i am back home kids', chatId: 12});