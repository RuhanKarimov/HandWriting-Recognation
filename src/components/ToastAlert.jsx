import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function ToastAlert({ show, setShow, message, variant = "danger" }) {
    return (
        <ToastContainer
            position="top-center"
            className="p-3"
            style={{ zIndex: 9999 }}
        >
            <Toast
                onClose={() => setShow(false)}
                show={show}
                bg={variant}
                delay={2000}
                autohide
            >
                <Toast.Body className="text-white text-center">
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
