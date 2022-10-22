import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {refreshToken} from "../Validation/refreshToken";

export const PrivateRoute = () => {
    let auth = null;
    if (localStorage.getItem("auth_token") !== null) {
        auth = true;

        let timeToken = localStorage.getItem('time_token_set');
        let now = Date.now();

        // time difference since token was crated
        let timeDifference = Math.round((now - timeToken) / 60000);

        // the token expires after one hour, at 55 min it will be refreshed
        if(timeDifference > 55){
            refreshToken();
        }
    }

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export  const LogOut = () => {
    localStorage.clear();
    return <Navigate to="/login" />;
}