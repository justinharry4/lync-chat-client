import Button from "../../components/Button/Button.js";
import IconButton from "../../components/IconButton/IconButton.js";

class Chat {
    view(){
        return '<div id="chat-container">This is the chat home page</div>'
    }
}

export default Chat;

let btn = new Button({
    labelText: 'first button',
    onClick: () => {console.log('First Button clicked!!!')},
});

let ibtn = new IconButton({
    iconLink: '/favicon.ico',
    onClick: () => {console.log('Icon Button Clicked!!!')}
});

let $btn = btn.render();
let $ibtn = ibtn.render();

$('#root').append($btn);
$('#root').append($ibtn);
