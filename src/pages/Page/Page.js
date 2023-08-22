import Component from "../../components/Component/Component.js";

import './base.css';

class Page extends Component {
    async renderPage(){
        let $root = $('#root');
        let $page = await this.render();
        
        $root.children().remove();
        $root.append($page);
    }
}

export default Page;