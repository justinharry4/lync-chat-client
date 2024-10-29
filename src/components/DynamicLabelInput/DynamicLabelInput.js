import Input from "../Input/Input.js";

import './DynamicLabelInput.css';

class DynamicLabelInput extends Input {
    baseCtx = {
        labelText: '',
        type: '',
        name: '',
        value: '',
    }

    constructor(...args){
        super(...args);

        this.state = {
            error: false,
        }

        this.childComponents = { Input };
        this.childContexts = {
            input: {
                ...this.ctx,
                labelText: '',
                onFocus: this.handleInputFocus,
                onBlur: this.handleInputBlur,
            }
        };
    }

    contextMethods(){
        return [this.handleError, this.clearError];
    }

    handleInputFocus(e){
        let $input = $(e.target);
        let $span = $input.closest('label').find('span');
        
        $span.addClass('focus');
    }

    handleInputBlur(e){
        let $input = $(e.target);
        
        if (!$input.val()){
            let $span = $input.closest('label').find('span');
            $span.removeClass('focus');
        }
    }

    handleError(e){
        let html = `<div class="dynamic-label__error-text">Invalid Input!</div>`;

        this.$element.addClass('error');
        this.$element.append($(html));
    }

    clearError(e){
        let errorDiv = this.$element.find('.dynamic-label__error-text');

        this.$element.removeClass('error');
        errorDiv.remove();
    }

    view(){
        return `
            <label 
                class="dynamic-label"
                lf--le-error:handleError|le-validInput:clearError--fl
            >
                <Component-lc lc--Input:input--cl></Component-lc>
                <span>lt--labelText--tl</span>
            </label>
        `
    }
} 

export default DynamicLabelInput;


{/* <label 
                class="dynamic-label ${(this.state.error) ? 'error': ''}"
                lf--le-error:handleError|le-validInput:clearError--fl
            >
                <Component-lc lc--Input:input--cl></Component-lc>
                ${(!this.childContexts.input.value) ? 
                    `<span>lt--labelText--tl</span>`: ''
                }
                ${(this.state.error) ? ` 
                    <div class="dynamic-label__error-text">Invalid Input!</div>
                `: ''}
            </label> */}