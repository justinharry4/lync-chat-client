import Component from "../../components/Component/Component.js";

import './base.css';

class Page extends Component {
    async renderPage(){
        let $page = await this.render();
        
        $('#root').append($page);
    }
}

export default Page;