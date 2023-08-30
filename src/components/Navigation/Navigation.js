import Component from "../Component/Component.js";
import IconButton from "../IconButton/IconButton.js";

import './Navigation.css';

let chatIconURL = new URL(
    '../../../public/images/svg/messages.svg',
    import.meta.url
)

let settingsIconURL = new URL(
    '../../../public/images/svg/settings.svg',
    import.meta.url
)


class Navigation extends Component {    
    constructor(...args){
        super(...args);

        this.childComponents = { IconButton };
        this.childContexts = {
            chat: {
                iconLink: chatIconURL,
                onClick: this.ctx.displayChats,
                type: 'button',
            },
            settings: {
                iconLink: settingsIconURL,
                onClick: this.displaySettings,
                type: 'button',
            }
        };
    }

    contextMethods(){
        return [this.displayChats];
    }

    displayChats(e){
        console.log('displaying chats...', this.app.userId);
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