import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './Modal.css'
import { IoClose } from "react-icons/io5";

const Modal = ({ children, title, isOpen, onClose }) => {
    // Cerrar con la tecla Esc
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
            // Bloquear scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden'
        }
        return () => {
            window.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <IoClose />
                    </button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default Modal
