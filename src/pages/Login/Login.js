import Page from "../Page/Page.js";
import DynamicLabelInput from "../../components/DynamicLabelInput/DynamicLabelInput.js";
import Button from '../../components/Button/Button.js'

import './Login.css';

class Login extends Page {
    constructor(...args){
        super(...args);

        this.state = {
            loginSuccessful: false,
        };
        
        this.childComponents = { Button, DynamicLabelInput };
        this.childContexts = {
            usn: {
                labelText: 'username',
                name: 'username',
                value: '',
                type: 'text'
            },
            pwd: {
                labelText: 'password',
                name: 'password',
                value: '',
                type: 'password',
            }, 
            submit: {
                labelText: 'Log In',
                type: 'submit',
                onClick: () => {},
            }
        };
    }

    contextMethods(){
        return [ this.handleLogin ];
    }

    async handleLogin(e){
        e.preventDefault();
        let app = this.app;
        let jwtCreateURL = '/auth/jwt/create/';
        let chatURL = '/chat';

        let $form = $(e.target);
        let data = new FormData($form.get(0));
        
        try {
            let response = await app.axios.post(jwtCreateURL, data);

            this.clearLoginError();

            app.setAuthCredentials(response.data);
            app.router.redirect(chatURL);
        } catch(error){
            if (error.response){
                this.handleLoginError(error.response, e);
            } else {
                console.log(error);
            }
        }
    }

    handleLoginError(response, e){
        let data = response.data;
        let $form = $(e.target);

        if (response.status == 400){
            this.clearLoginError();

            let $inputs = $form.find('input');

            $inputs.each((idx, el) => {
                let inputName = $(el).attr('name');
                let $parentLabel = $(el).closest('label');

                if (Object.keys(data).includes(inputName)){
                    let event = $.Event('le-error');
                    $parentLabel.trigger(event);
                } else {
                    let event = $.Event('le-validInput');
                    $parentLabel.trigger(event);
                }
            });
        } else {
            let $labels = $form.find('label');
            let event = $.Event('le-validInput');
            $labels.trigger(event);

            if (response.status === 401){
                this.showLoginError(data.detail);
            }
        }

        console.log(response.data);
    }

    showLoginError(errorMsg){
        let $wrapper = this.$element.find('.login__inputs-wrapper');
        let html = `<p id="login__create-error">${errorMsg}</p>`;

        $wrapper.append($(html));
    }

    clearLoginError(){
        let $errorPar = this.$element.find('#login__create-error');

        $errorPar.remove();
    }

    view(){
        return `
            <div id="login-root">
                <div id="login__top-wrapper">
                    <h1>Log in to your account</h1>
                    <form id="login__form" lf--submit:handleLogin--fl>
                        <div class="login__inputs-wrapper" >
                            <Component-lc lc--DynamicLabelInput:usn--cl ></Component-lc>
                            <Component-lc lc--DynamicLabelInput:pwd--cl ></Component-lc>
                        </div>
                        <Component-lc lc--Button:submit--cl id="login__submit"></Component-lc>
                    </form>
                    <div id="login__link-wrapper">
                        <a href="/signup" id="login__signup-link">Sign Up</a>
                    </div>
                </div>
            </div>
        `
    }
}

export default Login;