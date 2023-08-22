import axios from "axios";

import Router from "./routes/router.js"
import { AccessTokenError } from "./errors/errors.js";

class App {
    constructor(){
        this.router = new Router(this);

        this.isAuth = false;
        this.userId = null;

        this.axios = axios.create({
            baseURL: 'http://localhost:8000',
        });

        this.setDefaultAuthHeader();
    }

    async initialize(){
        let token = localStorage.getItem('accessToken');

        if (!token) {
            this.isAuth = false;
            this.userId = null
        } else {
            try {
                let userId = await this.fetchUserId();

                this.isAuth = true;
                this.userId = userId;
            } catch (error){
                if (error instanceof AccessTokenError){
                    // 
                }
            }
        }
    }

    async fetchUserId(){
        let accessURL = '/auth/users/me/';

        try {
            let response = await this.axios.get(accessURL);

            if (response.status == 200){
                let user = response.data;
                return user.id;
            }
        } catch (error){
            if (error.response){
                console.log(error.response);
                throw new AccessTokenError('Access Denied!');
            } else {
                console.log(error);
                throw new Error('an error occured');
            }
        }
    }

    setDefaultAuthHeader(){
        let token = localStorage.getItem('accessToken');
        if (token){
            let header = 'JWT ' + token;
            this.axios.defaults.headers.common['Authorization'] = header;
        }
    }

    async setAuthCredentials(tokens){
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        this.setDefaultAuthHeader();
    }
}

export default App;