import React from 'react'
import Modal from '../Modal/Modal'
import './DeleteConfirmModal.css'

/**
 * DeleteConfirmModal: Un modal genérico para confirmar eliminaciones.
 * 
 * @param {boolean} isOpen - Controla si el modal está abierto.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onConfirm - Función que se ejecuta al confirmar la eliminación.
 * @param {string} title - Título del modal.
 * @param {string|React.Element} message - Mensaje descriptivo de lo que se va a eliminar.
 * @param {string} confirmText - Texto del botón de confirmación (ej: "Eliminar canal").
 * @param {boolean} loading - Estado de carga del botón de confirmación.
 */
const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = '¿Confirmar eliminación?', 
    message, 
    confirmText = 'Sí, eliminar', 
    loading = false 
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="delete-confirm">
                <div className="delete-confirm__text">
                    {message}
                </div>
                <div className="delete-confirm__warning">
                    Esta acción es permanente y no se puede deshacer.
                </div>
                <div className="delete-confirm__actions">
                    <button 
                        className="btn btn--danger-solid" 
                        onClick={onConfirm} 
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : confirmText}
                    </button>
                    <button 
                        className="btn btn--secondary" 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteConfirmModal
