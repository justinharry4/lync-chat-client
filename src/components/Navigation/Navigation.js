import Component from "../Component/Component.js";
import IconButton from "../IconButton/IconButton.js";

class Navigation extends Component {    
    constructor(context){
        super(context);

        this.childComponents = { IconButton };
        this.childContexts = {
            chat: {
                iconLink: '/images/svg/messages-icon.svg',
                onClick: this.displayChats,
            }
        };
    }

    displayChats(e){
        console.log('displaying chats...');
        console.log(e);
    }

    view(){
        return `
            <nav id="side-nav">
                <ul>
                    <li>
                        <Component-lc lc--IconButton:chat--cl></Component-lc>
                    </li>
                    <li>
                        <Component-lc lc--IconButton:chat--cl></Component-lc>
                    </li>
                </ul>
            </nav>
        `
    }
}

export default Navigation;