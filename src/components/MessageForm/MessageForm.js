import Component from "../Component/Component.js";
import Input from "../Input/Input.js";
import IconButton from "../IconButton/IconButton.js";

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
                onFocus: this.handleInputFocus,
                onBlur: this.handleInputBlur,
            },
            submit: {
                type: 'submit',
                iconLink: sendIconURL,
                onClick: () => {},
            }
        }
    }

    contextMethods(){
        return [ this.submitMessage ];
    }

    submitMessage(e){
        e.preventDefault();

        console.log('submitting message...')
    }

    handleInputFocus(){
        console.log('focusing...');
    }

    handleInputBlur(){
        console.log('blurring...');
    }

    view(){
        return `
            <div class="message-form">
                <form class="message-form__form" lf--submit:submitMessage--fl>
                    <div class="message-form__text-wrapper">
                        <Component-lc lc--Input:text--cl></Component-lc>
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