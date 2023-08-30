import Component from '../Component/component.js';

import './SearchBox.css';

searchSvgURL = new URL(
    '../../../public/images/svg/search-1.svg',
    import.meta.url
)

class SearchBox extends Component {
    baseCtx = {
        placeholder: null,
        onSubmit: null,
    }

    view(){
        return `
            <div class="searchbox">
                <Svg-ls ls--${searchSvgURL}--sl></Svg-ls>
                <form lf--submit:onSubmit--fl>
                    <input type="text" name="search" placeholder="lt--placeholder--tl">
                </form>
            </div>
        `
    }
}

export default SearchBox;