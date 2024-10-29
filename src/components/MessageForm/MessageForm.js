import Component from "../Component/Component.js";
import Input from "../Input/Input.js";
import IconButton from "../IconButton/IconButton.js";
import TextMessage from "../TextMessage/TextMessage.js";

import './MessageForm.css';


let sendIconURL = new URL(
    '../../../public/images/svg/send-message.svg',
    import.meta.url
);

class MessageForm extends Component {
    baseCtx = {
        chatType: null,
        chatId: null,
    };

    constructor(...args){
        super(...args);

        this.childComponents = { Input, IconButton };
        this.childContexts = {
            text: {
                labelText: 'Type a message',
                type: 'text',
                name: 'text',
                value: '',
                onFocus: () => {},
                onBlur: () => {},
            },
            submit: {
                type: 'submit',
                iconLink: sendIconURL,
                onClick: () => {},
            }
        }
    }

    contextMethods(){
        return [ this.submitMessage, this.reconnect ];
    }

    async submitMessage(e){
        e.preventDefault();
        
        let $form = $(e.target);
        let data = new FormData($form.get(0));
        let message = data.get('text');
        
        if (message){
            let $chatbox = $form.closest('#chatbox');
            let $textInput = $form.find('input[type=text]');
    
            let event = $.Event('le-submitMessage');
            event.context = { text: message };
    
            $chatbox.trigger(event);
            $textInput.val('');
        }
    }

    reconnect(){
        let pcClient = this.app.pcClient;
        let ws = pcClient.ws;
        let badStates = [ws.CLOSED, ws.CLOSING];

        if (badStates.includes(ws.readyState)){
            pcClient.reconnect();
        }
    }

    view(){
        return `
            <div class="message-form">
                <form class="message-form__form" lf--submit:submitMessage|click:reconnect--fl>
                    <div class="message-form__text-wrapper">
                        <Component-lc lc--Input:text--cl>
                        </Component-lc>
                    </div>
                    <div class="message-form__submit-wrapper">
                        <Component-lc lc--IconButton:submit--cl></Component-lc>
                    </div>
                </form>
            </div>
        `
    }
}

export default MessageForm;