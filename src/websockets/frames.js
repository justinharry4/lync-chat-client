import protocol from "./protocol.js";
import { InvalidFrame, UnexpectedJSONInterface } from "../errors/errors.js";


const MAGIC_STR_LENGTH = protocol.HEADER_START.length;
const START_STR_POS = 0
const SEP_STR_POS = MAGIC_STR_LENGTH + protocol.HEADER_SIZE;
const END_STR_POS = -MAGIC_STR_LENGTH;


class TextFrame {
    constructor(key, code, data){
        this.key = key;
        this.code = code;
        this.body_data = data;

        this.generateFrame();
    }

    generateFrame(){
        let encoder = new TextEncoder();

        let start = encoder.encode(protocol.HEADER_START);
        let sep = encoder.encode(protocol.HEADER_END);
        let end = encoder.encode(protocol.BODY_END);

        let headerData = { 
            [protocol.HEADER_KEY]: this.key,
            [protocol.HEADER_CODE]: this.code,
            [protocol.HEADER_TYPE]: protocol.DATA_TYPE_TEXT,
        };
        let headerStr = JSON.stringify(headerData);
        let header = encoder.encode(headerStr);

        let bodyData = this.body_data;
        let bodyStr = JSON.stringify(bodyData);
        let body = encoder.encode(bodyStr);

        let parts = [start, header, sep, body, end];
        let byteLengths = parts.map(part => part.byteLength);

        let byteOffsets = byteLengths.map((bytes, idx, arr) => {
            let offset = 0;
            while (idx > 0){
                offset += arr[idx - 1];
                idx -= 1;
            }

            return offset;
        });

        let totalLength = byteLengths.reduce((acc, val) => (acc + val), 0);

        let frame = new Uint8Array(totalLength);

        frame.set(start, byteOffsets[0]);
        frame.set(header, byteOffsets[1]);
        frame.set(sep, byteOffsets[2]);
        frame.set(body, byteOffsets[3]);
        frame.set(end, byteOffsets[4]);

        this.data = frame;
    }


    static getFragments(text){
        let encoder = new TextEncoder();
        let array = encoder.encode(text);
        
        let num = array.byteLength / protocol.MAX_CONTENT_SIZE;
        let fixedNum = num.toFixed(15);
        let roundNum = parseInt(fixedNum);
        let fragmentCount = (fixedNum == roundNum) ? roundNum: roundNum + 1;
        
        let fragments = [];
        let decoder = new TextDecoder('utf-8');
        
        for (let i=0; i < fragmentCount; i++){
            let start = protocol.MAX_CONTENT_SIZE * i;

            let end;
            if (i + 1 < fragmentCount){
                end = protocol.MAX_CONTENT_SIZE * (i+1);
            }

            let byteFragment = array.slice(start, end);
            let fragment = decoder.decode(byteFragment);

            fragments.push(fragment);
        }

        return fragments;
    }
}


class FrameParser {
    constructor(message){
        this.rawMessage = message;
        this.decoder = new TextDecoder('utf-8');
    }

    validateMagicStrings(){
        let startStrEnd = START_STR_POS + MAGIC_STR_LENGTH;
        let startArr = this.rawMessage.slice(START_STR_POS, startStrEnd);
        let startStr = this.decoder.decode(startArr);

        let sepStrEnd = SEP_STR_POS + MAGIC_STR_LENGTH;
        let sepArr = this.rawMessage.slice(SEP_STR_POS, sepStrEnd);
        let sepStr = this.decoder.decode(sepArr);

        let endArr = this.rawMessage.slice(END_STR_POS);
        let endStr = this.decoder.decode(endArr);

        if (startStr != protocol.HEADER_START){
            throw new InvalidFrame(
                `Invalid header start string \`${startStr}\``
            );
        }
        if (sepStr != protocol.HEADER_END){
            throw new InvalidFrame(
                `Invalid sepaerator string \`${sepStr}\``
            );
        }
        if (endStr != protocol.BODY_END){
            throw new InvalidFrame(
                `Invalid body end string \`${endStr}\``
            );
        }
    }

    getHeader(){
        let headerStart = START_STR_POS + MAGIC_STR_LENGTH
        let headerEnd = SEP_STR_POS

        let headerArr = this.rawMessage.slice(headerStart, headerEnd);
        let headerStr = this.decoder.decode(headerArr);
        
        let header;
        try {
            header = JSON.parse(headerStr);
        } catch {
            throw new InvalidFrame(
                'header string is not valid JSON'
            );
        }

        let allowedHeaderKeys = [
            protocol.HEADER_KEY,
            protocol.HEADER_CODE,
            protocol.HEADER_TYPE
        ];

        for (let key in header){
            if (!allowedHeaderKeys.includes(key)){
                throw new UnexpectedJSONInterface(
                    `invalid key \`${key}\` in header`
                );
            }
        }

        return header;
    }

    getBody(){
        let bodyStart = SEP_STR_POS + MAGIC_STR_LENGTH;
        let bodyEnd = END_STR_POS;

        let bodyArr = this.rawMessage.slice(bodyStart, bodyEnd);
        let bodyStr = this.decoder.decode(bodyArr);

        let body;
        try {
            body = JSON.parse(bodyStr);
        } catch {
            throw new InvalidFrame(
                'body string is not valid JSON'
            );
        }

        return body;
    }

    parse(){
        this.validateMagicStrings();

        let header = this.getHeader();
        let body = this.getBody();

        let message = { header, body };

        return message
    }
}


export { TextFrame, FrameParser };