import Component from "../Component/Component.js";

import './BrandPoster.css';

class BrandPoster extends Component {
    view(){
        return `
            <section id="brand-poster">
                <p>Welcome to Lync</p>
            </section>
        `
    }
}

export default BrandPoster