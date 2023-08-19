import Page from "../Page/Page.js";
import Navigation from "../../components/Navigation/Navigation.js";
import MessageSection from "../../components/MessageSection/MessageSection.js";
import PhotoUploader from "../../components/PhotoUploader/PhotoUploader.js";

import './Chat.css';

class Chat extends Page {
    constructor(context){
        super(context);

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

    view(){
        return  `
            <div id="chat-root">
                <Component-lc lc--Navigation:nav--cl></Component-lc>
                <Component-lc lc--MessageSection:msgSection--cl></Component-lc>
            </div>
        `
        // <Component-lc lc--PhotoUploader:uploader--cl></Component-lc>
    }
}

export default Chat;
