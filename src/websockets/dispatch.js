import { CodeNotAllowed } from "../errors/errors.js";
import { serverStatus } from "./status.js";
import { CodeNotAllowed } from "../errors/errors.js";


function messageHandler(allowedCodes, fn){
    fn.isHandler = true;
    fn.allowedCodes = allowedCodes;

    return fn;
}


function ackHandler(allowedClientCodes, fn){
    function wrappedFn(...args){
        let messageBody = args[2];
        let clientCode = messageBody['client_code'];

        if (!allowedClientCodes.includes(clientCode)){
            throw CodeNotAllowed(
                `client status code \`${server_code}\` is not ` +
                `allowed by the acknowledgement handler`
            );
        }

        fn(...args);
    }

    return messageHandler([serverStatus.ACKNOWLEDGMENT], wrappedFn);
}


class Dispatcher {
    constructor(chatInterface, ...handlerSetClasses){
        this.chat = chatInterface;
        this.handlers = [];

        for (let cls of handlerSetClasses){
            let handlerSet = new cls(chatInterface);
            let handlers = handlerSet.getHandlers();

            this.handlers = this.handlers.concat(handlers);
        }
    }

    dispatch(message){
        let header = message.header;
        let statusCode = header['status_code'];

        // console.log('all', this.handlers);
        for (let handler of this.handlers){
            if (handler.allowedCodes.includes(statusCode)){
                try {
                    // console.log('allowed', handler.allowedCodes);
                    handler(header.key, statusCode, message.body);
                    break;
                } catch (err){
                    if (err instanceof CodeNotAllowed){
                        continue;
                    }
                }
            }
        }
    }
}


class HandlerSet {
    constructor(chatInterface){
        this.interface = chatInterface;
    }

    getHandlers(){
        let handlers = [];
        for (let value of Object.values(this)){
            if (value.isHandler){
                handlers.push(value)
            }
        }

        return handlers;
    }
}


export { 
    messageHandler,
    ackHandler,
    Dispatcher,
    HandlerSet
};