import Page from "../Page/Page.js";
import Navigation from "../../components/Navigation/Navigation.js";
import MessageSection from "../../components/MessageSection/MessageSection.js";
import ChatBox from "../../components/ChatBox/ChatBox.js";
import PhotoUploader from "../../components/PhotoUploader/PhotoUploader.js";

import './Chat.css';

class Chat extends Page {
    constructor(...args){
        super(...args);

        this.childComponents = { 
            Navigation,
            MessageSection,
            PhotoUploader,
        };
        this.childContexts = {
            nav: {},
            msgSection: {},
            uploader: {},
        }
    }

    contextMethods(){
        return [ this.displayChatBox ];
    }

    async displayChatBox(e){
        let $page = $(e.target);
        let ctx = e.context.ctx;

        let chatbox = new ChatBox(this.app, ctx);
        let $chatbox = await chatbox.render();
        let $oldChatbox = $page.find('#chatbox');

        $oldChatbox.remove();
        $page.append($chatbox);
    }

    view(){
        return  `
            <div id="chat-root" lf--le-openChatBox:displayChatBox--fl>
                <Component-lc lc--Navigation:nav--cl></Component-lc>
                <Component-lc lc--MessageSection:msgSection--cl></Component-lc>
            </div>
        `
        // <Component-lc lc--PhotoUploader:uploader--cl></Component-lc>
    }
}

export default Chat;
