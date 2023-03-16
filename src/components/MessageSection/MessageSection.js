import Component from "../Component/Component.js";
import SearchBox from "../SearchBox/SearchBox.js";
import MessageBanner from "../MessageBanner/MessageBanner.js";

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

    async getMessages(){
        let promise = new Promise((resolve, reject) => {
            let msgdata = [];
            for (let i=1; i<=10; i++){
                msgdata.push({
                    id: 'num' + i,
                    ctx: {
                        photoUrl: '/images/raster/tiger.jpg',
                        contactName: 'Will Hansen',
                        msgTime: '02:06',
                        message: 'Good morning to you all!',
                        status: i,
                    }
                });
            }
            
            this.contactIds = [];
            for (let entry of msgdata){
                this.childContexts[entry.id] = entry.ctx;
                this.contactIds.push(entry.id);
            }

            resolve(this.ctx);
        });

        return promise
    }

    async view(){
        await this.getMessages();

        return `
            <section id="msg-section">
                <h1>Messages</h1>
                <Component-lc lc--SearchBox:search--cl></Component-lc>
                <div id="msg-section__pinned-msgs">
                </div>
                <div id="msg-section__all-msgs">
                    <h2>All Messages</h2>
                    <ul>
        ` +
        this.iterStr(this.contactIds, (id) => {
            return `
                <li>
                    <Component-lc lc--MessageBanner:${id}--cl></Component-lc>
                </li>
            `
        }) +
        `         </ul>
                </div>
            </section>
        `
    }
}

export default MessageSection;