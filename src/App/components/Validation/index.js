import $ from 'jquery';

export const validateEmail = (sEmailToCheck) => {
    /* emailChecker = verify a valid email */
    let emailChecker = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line
    return emailChecker.test($.trim(sEmailToCheck));
}