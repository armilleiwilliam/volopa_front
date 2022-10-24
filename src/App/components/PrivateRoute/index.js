import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {refreshToken} from "../Validation/refreshToken";

var tokenTimeOut = null;
export const PrivateRoute = () => {
    let auth = null;

    if (localStorage.getItem("auth_token") !== null) {
        auth = true;

        // refresh token after 55 min, right before the 1 hour expiration time
        clearTimeout(tokenTimeOut);
        tokenTimeOut = setTimeout(refreshToken(), 1000 * 60 * 55);
    }

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export  const LogOut = () => {
    localStorage.clear();
    return <Navigate to="/login" />;
}