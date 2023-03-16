import Component from "../../components/Component/Component.js";

class Page extends Component {
    async renderPage(){
        let $page = await this.render();
        
        $('#root').append($page);
    }
}

export default Page;