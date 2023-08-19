import Component from "../Component/Component.js";
import SearchBox from "../SearchBox/SearchBox.js";
import MessageBanner from "../MessageBanner/MessageBanner.js";

import './MessageSection.css';


let defaultPhotoURL = new URL(
    '../../../public/images/raster/tiger.jpg',
    import.meta.url
)

class MessageSection extends Component {
    constructor(context){
        super(context);

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
        let msgdata = await this.getMessages();
        
        this.addChildContextGroup('ctc', msgdata);
    }

    async getMessages(){
        let promise = new Promise((resolve, reject) => {
            let msgdata = [];
            for (let i=1; i<=10; i++){
                msgdata.push({
                    photoUrl: defaultPhotoURL,
                    contactName: 'Will Hansen',
                    msgTime: '02:06',
                    message: 'Good morning to you all!',
                    status: i,
                });
            }
            
            resolve(msgdata);
        });

        return promise
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
                    ${this.autoSubCompIterStr('ctc', (ctxName) => { 
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