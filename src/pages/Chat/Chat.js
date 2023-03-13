import Button from "../../components/Button/Button.js";
import IconButton from "../../components/IconButton/IconButton.js";
import Navigation from "../../components/Navigation/Navigation.js";

class Chat {
    view(){
        return '<div id="chat-container">This is the chat home page</div>'
    }
}

export default Chat;


let nav = new Navigation({});
let $nav = await nav.render();

// console.log($nav.get(0));
$('#root').append($nav);
