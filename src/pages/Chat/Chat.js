import Page from "../Page/Page.js";
import Navigation from "../../components/Navigation/Navigation.js";
import MessageSection from "../../components/MessageSection/MessageSection.js";

class Chat extends Page {
    constructor(context){
        super(context);

        this.childComponents = { 
            Navigation,
            MessageSection,
        };
        this.childContexts = {
            nav: {},
            msgSection: {}
        }
    }

    view(){
        return  `
            <div id="chat-root">
                <Component-lc lc--Navigation:nav--cl></Component-lc>
                <Component-lc lc--MessageSection:msgSection--cl></Component-lc>
            </div>
        `
    }
}

export default Chat;
