function messageHandler(fn, allowedCodes){
    fn.isHandler = true;
    fn.allowedCodes = allowedCodes;

    return fn;
}


class Dispatcher {
    constructor(chatInterface){
        this.interface = chatInterface;

        this.handlers = [];
        for (let propValue of Object.values(chatInterface)){
            if (propValue.isHandler){
                this.handlers.push(propValue);
            }
        }
    }

    dispatch(message){
        let header = message.header;
        let statusCode = header['status_code'];

        for (let handler of this.handlers){
            if (handler.allowedCodes.includes(statusCode)){
                handler(header.key, statusCode, message.body);

                break;
            }
        }
    }
}


export { Dispatcher, messageHandler };