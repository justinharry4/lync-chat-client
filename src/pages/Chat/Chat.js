import Page from "../Page/Page.js";
import Navigation from "../../components/Navigation/Navigation.js";
import MessageSection from "../../components/MessageSection/MessageSection.js";
import ChatBox from "../../components/ChatBox/ChatBox.js";
import BrandPoster from "../../components/BrandPoster/BrandPoster.js";

import './Chat.css';

class Chat extends Page {
    constructor(...args){
        super(...args);

        this.childComponents = { 
            Navigation,
            MessageSection,
            BrandPoster,
        };
        this.childContexts = {
            nav: {},
            msgSection: {},
            poster: {},
        }

        this.backgroundChatboxes = [];
    }

    contextMethods(){
        return [ this.handleOpenChatBox ];
    }

    async handleOpenChatBox(e){
        // let $page = $(e.target);
        let ctx = e.context.ctx;

        let activeChatboxMember = this.tree.children('ChatBox')[0];
        console.log('active cb member', activeChatboxMember);

        if (activeChatboxMember){
            let activeChatbox = activeChatboxMember.cmp;

            if (!this.isChatbox(ctx, activeChatbox)){
                activeChatbox.remove();
                this.backgroundChatboxes.push(activeChatbox);

                await this.displayChatbox(ctx);
            }
        } else {
            await this.displayChatbox(ctx);
        }

        // let $poster = $page.find('#brand-poster');
        // $poster.remove();

        // let chatbox = new ChatBox(this.app, ctx);
        // let $chatbox = await chatbox.render(this);
        // $page.append($chatbox);

        console.log('background', this.backgroundChatboxes);
    }

    getBackgroundChatbox(ctx){
        let index = this.backgroundChatboxes.findIndex((cb, idx) => {
            return this.isChatbox(ctx, cb);
        });

        let ret_array = [this.backgroundChatboxes[index], index]
        return ret_array;
    }

    isChatbox(ctx, chatbox){
        let isChatId = chatbox.ctx.chatId == ctx.chatId;
        let isChatType = chatbox.ctx.chatType == ctx.chatType;

        return isChatId && isChatType;
    }

    async displayChatbox(ctx){
        let posterMember = this.tree.children('BrandPoster')[0];
        if (posterMember){
            posterMember.cmp.remove();
        }

        let [bgChatbox, index] = this.getBackgroundChatbox(ctx);
        if (bgChatbox){
            console.log('redisplaying background chatbox');

            this.add(bgChatbox, this.$element);
            this.backgroundChatboxes.splice(index, 1);
        } else {
            let chatbox = new ChatBox(this.app, ctx);
            let $chatbox = await chatbox.render(this);
            this.$element.append($chatbox);
        }
    }

    view(){
        return  `
            <div id="chat-root" lf--le-openChatBox:handleOpenChatBox--fl>
                <Component-lc lc--Navigation:nav--cl></Component-lc>
                <Component-lc lc--MessageSection:msgSection--cl></Component-lc>
                <Component-lc lc--BrandPoster:poster--cl></Component-lc>
            </div>
        `
    }
}

export default Chat;
