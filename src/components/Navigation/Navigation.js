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
            },
            settings: {
                iconLink: '/images/svg/settings-icon.svg',
                onClick: this.displaySettings,
            }
        };
    }

    displayChats(e){
        console.log('displaying chats...');
    }

    displaySettings(e){
        console.log('displaying settings...');
    }

    view(){
        return `
            <nav id="side-nav">
                <ul>
                    <li>
                        <Component-lc lc--IconButton:chat--cl id="side-nav__chat"></Component-lc>
                    </li>
                    <li>
                        <Component-lc lc--IconButton:settings--cl id="side-nav__settings"></Component-lc>
                    </li>
                </ul>
            </nav>
        `
    }
}

export default Navigation;