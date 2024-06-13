import Component from "../Component/Component.js";
import SearchBox from "../SearchBox/SearchBox.js";
import MessageBanner from "../MessageBanner/MessageBanner.js";

import { toHourMinuteFormat, MSG_FORMATS } from "../../utils/utils.js";

import './MessageSection.css';


let defaultPhotoURL = new URL(
    '../../../public/images/raster/tiger.jpg',
    import.meta.url
)


class MessageSection extends Component {
    constructor(...args){
        super(...args);

        this.childComponents = { SearchBox, MessageBanner };

        this.childContexts = {
            search: { 
                placeholder: 'Search...',
                onSubmit: this.submitSearch,
            },
        }
    }

    submitSearch(e){
        e.preventDefault();
        console.log('search submitted!');
    }

    async postRender(){
        let bannerContexts = await this.getBannerContexts();
        let orderedBannerContexts = this.sortBannerContexts(bannerContexts);
        let $ul = this.$element.find('ul');

        for (let ctx of orderedBannerContexts){
            let banner = new MessageBanner(this.app, ctx);
            let $banner = await banner.render(this);

            let $listItem = $('<li>');
            $listItem.append($banner);
            
            $ul.append($listItem);
        }

        console.log(this.tree);
    }

    sortBannerContexts(bannerContexts){
        return bannerContexts.sort((ctx1, ctx2) => {
            let date1 = new Date(ctx1.timeStamp);
            let date2 = new Date(ctx2.timeStamp);

            if (date1 < date2){
                return 1;
            } else if (date1 == date2){
                return 0;
            } else {
                return -1;
            }
        });
    }

    async getBannerContexts(){
        let app = this.app;
        let bannerContexts = [];

        try {
            let privateChatsURL = '/chat/privatechats/';
            let pcResponse = await app.axios.get(privateChatsURL);
            let privateChats = pcResponse.data;
            
            for (let pc of privateChats){
                let participants = pc.participants;

                let [userId] = participants
                    .map((ppt) => ppt.user)
                    .filter((id) => id != app.userId);
                
                let userURL = '/auth/users/' + userId + '/';
                let userResponse = await app.axios.get(userURL);

                let user = userResponse.data;
                let username = user.username;
                let profileId = user.profile;

                let bannerPhotoURL = await this.getPhotoUrl(profileId);
                let { message, unreadCount } = await this.getBannerMessageData(pc);

                console.log('last msg', message);
                
                let bannerCtx = {
                    photoUrl: bannerPhotoURL,
                    chatTitle: username,
                    chatType: 'PC',
                    chatId: pc.id,
                    unreadCount: unreadCount,
                }

                if (message){
                    let timeStamp = message['time_stamp'];
                    bannerCtx = {
                        ...bannerCtx,
                        message: this.getMessageTextForm(message),
                        timeStamp: timeStamp,
                        status: message['delivery_status'],
                    }
                } else {
                    const blank = ' ';
                    bannerCtx = {
                        ...bannerCtx,
                        message: blank,
                        timeStamp: 1000,
                        status: blank,
                    }
                }

                bannerContexts.push(bannerCtx);
            }

            return bannerContexts;
        } catch (error){
            let response = error.response;

            if (response && response.status == 401){
                // app.handle401(response);
            }
            console.log(error);
        };
    }

    async getPhotoUrl(profileId){
        let app = this.app;
        let photoURL = `/chat/profiles/${profileId}/photo/`;
        
        let photoResponse = await app.axios.get(photoURL);
        let [photo] = photoResponse.data;

        let domain = app.axios.defaults.baseURL;
        let bannerPhotoURL = (photo) ? domain + photo.image: defaultPhotoURL;

        return bannerPhotoURL;
    }

    async getBannerMessageData(privateChat){
        let app = this.app;
        let pcId = privateChat.id;
        let currentChatURL = `/chat/privatechats/${pcId}/chats/current/`;

        let chatResponse = await app.axios.get(currentChatURL);
        let currentChat = chatResponse.data;
        let chatId = currentChat.id;

        console.log('in last message', currentChat);

        let message, unreadCount;
        if (chatId){
            let queryParamStr = '?category=unread';
            let unreadURL = `/chat/privatechats/${pcId}/chats/${chatId}/messages/`;
            let fullUnreadURL = unreadURL + queryParamStr;
            let msgResponse = await app.axios.get(fullUnreadURL);
            let msgData = msgResponse.data;

            unreadCount = msgData['unread_count'];
            
            if (unreadCount > 0){
                console.log('is unread');

                message = msgData.results.slice(-1)[0];
            } else {
                console.log('is initial');

                let queryParamStr = '?category=iniital';
                let initialURL = `/chat/privatechats/${pcId}/chats/${chatId}/messages/`;
                let fullInitialURL = initialURL + queryParamStr;
                let msgResponse = await app.axios.get(fullInitialURL);
                let msgData = msgResponse.data;

                if (msgData['result_count'] > 0){
                    message = msgData.results.slice(-1)[0];
                }
            }
        } else {
            unreadCount = 0;
        }

        return { message, unreadCount };
    }

    getMessageTextForm(message){
        let text;
        if (message['content_format'] == MSG_FORMATS.TEXT){
            text = message.content.text;
        } else if (message['content_format'] == MSG_FORMATS.IMAGE){
            text = '-- Photo --';
        } else if (message['content_format'] == MSG_FORMATS.AUDIO){
            text = '-- Audio --';
        } else if (message['content_format'] == MSG_FORMATS.VIDEO){
            text = '-- Video --';
        }

        return text
    }

    // async generateChildContexts(){
    //     let chatData = await this.getChats();
        
    //     this.addChildContextGroup('chat', chatData);
    // }

    // async getChats(){
    //     let app = this.app;
    //     let chatData = [];

    //     try {
    //         let privateChatsURL = '/chat/privatechats/';
    //         let pcResponse = await app.axios.get(privateChatsURL);
    //         let privateChats = pcResponse.data;
            
    //         for (let pc of privateChats){
    //             let participants = pc.participants;

    //             let [userId] = participants
    //                 .map((ppt) => ppt.user)
    //                 .filter((id) => id != app.userId);
                
    //             let userURL = '/auth/users/' + userId + '/';
    //             let userResponse = await app.axios.get(userURL);

    //             let user = userResponse.data;
    //             let username = user.username;
    //             let profileId = user.profile;

    //             let photoURL = '/chat/profiles/' + profileId + '/photo/';
    //             let photoResponse = await app.axios.get(photoURL);
    //             let [photo] = photoResponse.data;

    //             let domain = app.axios.defaults.baseURL;
    //             // let bannerPhotoPath = (photo) ? photo.image: defaultPhotoURL;
    //             // let bannerPhotoURL = domain + bannerPhotoPath;
    //             let bannerPhotoURL = (photo) ? domain + photo.image: defaultPhotoURL;
                
    //             let bannerCtx = {
    //                 photoUrl: bannerPhotoURL,
    //                 chatTitle: username,
    //                 message: 'some text message',
    //                 messageTime: '14:25',
    //                 status: 'D',
    //                 chatType: 'PC',
    //                 chatId: pc.id,
    //             }

    //             chatData.push(bannerCtx);
    //         }

    //         return chatData;
    //     } catch (error){
    //         let response = error.response;

    //         if (response && response.status == 401){
    //             // this.app.handle401(response);
    //         }
    //         console.log(error);
    //     };
    // }

    // viewOld(){
    //     return `
    //         <section id="msg-section">
    //             <h1>Messages</h1>
    //             <Component-lc lc--SearchBox:search--cl></Component-lc>
    //             <div id="msg-section__pinned-msgs">
    //             </div>
    //             <div id="msg-section__all-msgs">
    //                 <h2>All Messages</h2>
    //                 <ul>
    //                 ${this.autoSubCompIterStr('chat', (ctxName) => { 
    //                 return `
    //                     <li>
    //                         <Component-lc lc--MessageBanner:${ctxName}--cl></Component-lc>
    //                     </li>
    //                 `
    //                 })}
    //                 </ul>
    //             </div>
    //         </section>
    //     `
    // }

    view(){
        return `
            <section id="msg-section">
                <div id="msg-section__top-container">
                    <h1>Messages</h1>
                    <Component-lc lc--SearchBox:search--cl></Component-lc>
                    <div id="msg-section__pinned-msgs">
                    </div>
                </div>
                <div id="msg-section__all-msgs">
                    <h2>All Messages</h2>
                    <ul></ul>
                </div>
            </section>
        `
    }
}

export default MessageSection;