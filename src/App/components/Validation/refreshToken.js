import $ from 'jquery';
import axios from "axios";

export const refreshToken = () => {
    let payload = {
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
    }

    axios.post(`${process.env.REACT_APP_LARAVEL_SITE}/login`, payload)
        .then(resp => {
            let response = resp.data.data;
            if (resp.data.message == "success") {

                // store token
                localStorage.setItem('auth_token', response.token);
                let timeElapsedToken = Date.now();

                // check when the token was stored to be renewed after one hour
                localStorage.setItem('time_token_set', timeElapsedToken);
            }
        });
}