import React, { useState, useRef, useEffect } from 'react'
import Modal from '../Modal/Modal'
import './WorkspaceFormModal.css'
import useRequest from '../../hooks/useRequest'
import useForm from '../../hooks/useForm'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'
import { updateWorkspace, createWorkspace, deleteWorkspace } from '../../service/workspace.service'
import ENVIRONMENT from '../../config/environment.config'
import { FaTrash, FaEdit, FaSave, FaTimes, FaCamera, FaPlus } from 'react-icons/fa'

/**
 * WorkspaceFormModal: Maneja la creación, edición y visualización de espacios de trabajo.
 * 
 * @param {object} workspace - Datos del espacio (solo para edit/view).
 * @param {string} mode - 'create', 'edit' o 'view'.
 * @param {boolean} isOpen - Estado del modal.
 * @param {function} onClose - Función para cerrar.
 * @param {function} onRefresh - Función para recargar la lista de espacios.
 */
const WorkspaceFormModal = ({ workspace, mode = 'create', isOpen, onClose, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const hasRefreshed = useRef(false)
    const fileInputRef = useRef(null)

    const { sendRequest: sendSubmit, resetRequest, loading: submitting, error: submitError, response: submitResponse } = useRequest()

    const { formState, handleChangeInput, setFields, resetForm, onSubmit } = useForm({
        initialFormState: {
            title: '',
            description: '',
            image: null,
            imagePreview: null
        },
        submitFn: async (values) => {
            if (mode === 'create' || !workspace) {
                await sendSubmit({
                    requestCb: () => createWorkspace({
                        title: values.title,
                        description: values.description,
                        image: values.image
                    })
                })
            } else {
                await sendSubmit({
                    requestCb: () => updateWorkspace({
                        workspace_id: workspace.workspace_id,
                        title: values.title,
                        description: values.description,
                        image: values.image,
                    })
                })
            }
        }
    })

    // Sincronizar estado con el workspace recibido o resetear para creación
    useEffect(() => {
        if (isOpen) {
            if (workspace && mode !== 'create') {
                setFields({
                    title: workspace.workspace_title || '',
                    description: workspace.workspace_description || '',
                    image: null,
                    imagePreview: null
                })
                setIsEditing(mode === 'edit')
            } else {
                resetForm()
                setIsEditing(true)
            }
            hasRefreshed.current = false
            resetRequest()
        }
    }, [workspace, mode, isOpen, resetRequest])

    const handleEditToggle = (e) => {
        if (e && e.preventDefault) e.preventDefault()
        resetRequest() // Limpiar estados de peticiones previas al cambiar de modo
        if (isEditing && mode !== 'create') {
            // Cancelar edición: resetear valores
            setFields({
                title: workspace.workspace_title || '',
                description: workspace.workspace_description || '',
                image: null,
                imagePreview: null
            })
        }
        setIsEditing(!isEditing)
    }

    // Efecto para manejar el éxito
    useEffect(() => {
        let timeoutId
        if (submitResponse && submitResponse.ok && !hasRefreshed.current) {
            hasRefreshed.current = true
            timeoutId = setTimeout(() => {
                onRefresh()
                if (mode === 'create') {
                    onClose()
                } else {
                    setIsEditing(false)
                }
            }, 1000)
        }

        if (!submitResponse) {
            hasRefreshed.current = false
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [submitResponse, onRefresh, onClose, mode])

    const currentImage = workspace?.workspace_image?.startsWith('http')
        ? workspace.workspace_image
        : workspace?.workspace_image ? ENVIRONMENT.API_URL + workspace.workspace_image : null

    const getInitials = (t) => {
        if (!t) return '?'
        return t.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }

    const modalTitle = mode === 'create'
        ? 'Nuevo Espacio de Trabajo'
        : isEditing ? 'Editar Espacio' : 'Detalles del Espacio'

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    if (!submitting) onClose()
                }}
                title={modalTitle}
            >
                <div className="ws-form">
                    <form onSubmit={onSubmit}>
                        <div className="ws-form__header">
                            <div className="ws-form__image-container">
                                {formState.imagePreview || currentImage ? (
                                    <img
                                        src={formState.imagePreview || currentImage}
                                        alt={formState.title}
                                        className="ws-form__img"
                                    />
                                ) : (
                                    <div className="ws-form__initials">
                                        {getInitials(formState.title)}
                                    </div>
                                )}

                                {isEditing && (
                                    <button
                                        className="ws-form__image-edit"
                                        onClick={() => fileInputRef.current.click()}
                                        type="button"
                                        disabled={submitting}
                                    >
                                        <FaCamera />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleChangeInput}
                                    accept="image/*"
                                    required={false}
                                />
                            </div>
                            {isEditing && <p className="ws-form__image-help">Sube un logo para tu equipo</p>}
                        </div>

                        <div className="ws-form__fields">
                            <div className="form-group">
                                <label className="form-label">Nombre del Espacio</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    value={formState.title}
                                    onChange={handleChangeInput}
                                    readOnly={!isEditing}
                                    placeholder="Ej: Equipo de Desarrollo"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    name="description"
                                    className="form-textarea form-input"
                                    value={formState.description}
                                    onChange={handleChangeInput}
                                    readOnly={!isEditing}
                                    placeholder="¿Misión del equipo?"
                                    rows="3"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                        </div>

                        {submitError && <div className="alert alert--error">{submitError.message || 'Error en la operación'}</div>}
                        {submitResponse && submitResponse.ok && (
                            <div className="alert alert--success">
                                {mode === 'create' ? '¡Espacio creado con éxito!' : '¡Cambios guardados!'}
                            </div>
                        )}

                        <div className="ws-form__actions">
                            {!isEditing ? (
                                <>
                                    {(!workspace || workspace.workspace_role === 'owner') && (
                                        <>
                                            <button type="button" className="btn btn--secondary" onClick={handleEditToggle}>
                                                <FaEdit /> Editar
                                            </button>
                                            <button type="button" className="btn btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                                                <FaTrash /> Eliminar
                                            </button>
                                        </>
                                    )}
                                    {workspace && workspace.workspace_role !== 'owner' && (
                                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                                            <FaTimes /> Cerrar
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {mode !== 'create' && (
                                        <button type="button" className="btn btn--secondary" onClick={handleEditToggle} disabled={submitting}>
                                            <FaTimes /> Cancelar
                                        </button>
                                    )}
                                    <button type="submit" className="btn btn--primary" disabled={submitting}>
                                        {mode === 'create' ? <FaPlus /> : <FaSave />}
                                        {submitting ? 'Procesando...' : (mode === 'create' ? 'Crear Espacio' : 'Guardar Cambios')}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>

            {mode !== 'create' && workspace && (
                <DeleteConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={async () => {
                        await sendSubmit({
                            requestCb: () => deleteWorkspace({ workspace_id: workspace.workspace_id })
                        })
                        setShowDeleteConfirm(false)
                        onClose()
                    }}
                    title="¿Eliminar espacio?"
                    message={<p>¿Seguro que quieres borrar <strong>{workspace.workspace_title}</strong>? Esta acción es irreversible.</p>}
                    loading={submitting}
                />
            )}
        </>
    )
}

export default WorkspaceFormModal
