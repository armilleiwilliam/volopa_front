import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import ModalContent from "./modalContent";
import {ModalDataContext} from "../RateChecker";

function ModalBase() {

    const [smShow, setSmShow] = useState(false);
    const handleClose = () => setSmShow(false);
    const modalContext = React.useContext(ModalDataContext);

    useEffect(() => {
            setSmShow(modalContext.show_modal);
    }, [modalContext]);

    return (
        <>
            <Modal show={smShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalContext.error_title !== "" ? modalContext.error_title : "Conversion result:"}
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContext.error_message !== "" ? modalContext.error_message : <ModalContent  />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalBase;