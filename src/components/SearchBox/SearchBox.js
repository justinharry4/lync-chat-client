import Component from '../Component/component.js';


class SearchBox extends Component {
    baseCtx = {
        placeholder: null,
        onSubmit: null,
    }

    view(){
        return `
            <div class="searchbox">
                <Svg-ls ls--/images/svg/search-browse.svg--sl></Svg-ls>
                <form lf--submit:onSubmit--fl>
                    <input type="text" name="search" placeholder="lt--placeholder--tl">
                </form>
            </div>
        `
    }
}

export default SearchBox;