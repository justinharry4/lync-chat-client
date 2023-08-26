import Component from "../Component/Component.js";
import SearchBox from "../SearchBox/SearchBox.js";
import MessageBanner from "../MessageBanner/MessageBanner.js";

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

    async generateChildContexts(){
        let chatData = await this.getChats();
        
        this.addChildContextGroup('chat', chatData);
    }

    async getChats(){
        let app = this.app;
        let chatData = [];

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

                let photoURL = '/chat/profiles/' + profileId + '/photo/';
                let photoResponse = await app.axios.get(photoURL);
                let [photo] = photoResponse.data;

                let domain = app.axios.defaults.baseURL;
                let bannerPhotoPath = (photo) ? photo.image: defaultPhotoURL;
                let bannerPhotoURL = domain + bannerPhotoPath;
                
                let bannerCtx = {
                    photoUrl: bannerPhotoURL,
                    chatTitle: username,
                    message: 'some text message',
                    messageTime: '14:25',
                    status: 'D',
                    chatType: 'PC',
                    chatId: pc.id,
                }

                chatData.push(bannerCtx);
            }

            return chatData;
        } catch (error){
            let response = error.response;

            if (response && response.status == 401){
                // this.app.handle401(response);
            }
            console.log(error);
        };
    }

    view(){
        return `
            <section id="msg-section">
                <h1>Messages</h1>
                <Component-lc lc--SearchBox:search--cl></Component-lc>
                <div id="msg-section__pinned-msgs">
                </div>
                <div id="msg-section__all-msgs">
                    <h2>All Messages</h2>
                    <ul>
                    ${this.autoSubCompIterStr('chat', (ctxName) => { 
                    return `
                        <li>
                            <Component-lc lc--MessageBanner:${ctxName}--cl></Component-lc>
                        </li>
                    `
                    })}
                    </ul>
                </div>
            </section>
        `
    }
}

export default MessageSection;