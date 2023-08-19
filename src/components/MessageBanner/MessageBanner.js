import Component from "../Component/component.js";

import './MessageBanner.css';

class MessageBanner extends Component {
    baseCtx = {
        photoUrl: null,
        contactName: null,
        msgTime: null,
        message: null,
        status: null,
    }

    view(){
        return `
            <div class="msg-banner">
                <img class="msg-banner__photo" src="lt--photoUrl--tl" alt="profile photo">
                <div class="msg-banner__msg-container">
                    <div class="msg-banner__name-wrapper">
                        <b>lt--contactName--tl</b>
                        <time>lt--msgTime--tl</time>
                    </div>
                    <div class="msg-banner__msg-wrapper">
                        <span class="msg-banner__message">lt--message--tl</span>
                        <span class="msg-banner__msg-status">lt--status--tl</span>
                    </div>
                </div>
            </div>
        `
    }
}

export default MessageBanner;