import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {ModalDataContext} from "../RateChecker";

// Modal showing successful and unsuccessful message alerts
function ModalContent() {
    const modalContext = React.useContext(ModalDataContext);
    return (
        <>
            <div className="row">
                <div className="col-md-5">Initial Amount:</div>
                <div
                    className="col-md-7">{Number.parseFloat(modalContext.amount_to_exchange).toFixed(2)} {modalContext.currencyFrom}</div>
            </div>
            <div className="row">
                <div className="col-md-5">Amount exchanged:</div>
                <div
                    className="col-md-7">{Number.parseFloat(modalContext.amount_exchanged).toFixed(2)} {modalContext.currencyTo}</div>
            </div>
            <div className="row">
                <div className="col-md-5">Rate:</div>
                <div className="col-md-7">
                    {modalContext.rate}</div>
            </div>
        </>
    );
}

export default ModalContent;