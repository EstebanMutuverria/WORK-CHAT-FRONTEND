import React, { useState, useRef, useEffect } from 'react'
import Modal from '../Modal/Modal'
import './WorkspaceFormModal.css'
import useRequest from '../../hooks/useRequest'
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
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const fileInputRef = useRef(null)
    const hasRefreshed = useRef(false)

    const { sendRequest: sendSubmit, resetRequest, loading: submitting, error: submitError, response: submitResponse } = useRequest()

    // Sincronizar estado con el workspace recibido o resetear para creación
    useEffect(() => {
        if (isOpen) {
            if (workspace && mode !== 'create') {
                setTitle(workspace.workspace_title || '')
                setDescription(workspace.workspace_description || '')
                setIsEditing(mode === 'edit')
            } else {
                setTitle('')
                setDescription('')
                setImage(null)
                setImagePreview(null)
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
            setTitle(workspace.workspace_title || '')
            setDescription(workspace.workspace_description || '')
            setImagePreview(null)
            setImage(null)
        }
        setIsEditing(!isEditing)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) return

        if (mode === 'create' || !workspace) {
            await sendSubmit({
                requestCb: () => createWorkspace({
                    title,
                    description,
                    image
                })
            })
        } else {
            await sendSubmit({
                requestCb: () => updateWorkspace({
                    workspace_id: workspace.workspace_id,
                    title,
                    description,
                    image: image,
                })
            })
        }
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
                    <form onSubmit={handleSubmit}>
                        <div className="ws-form__header">
                            <div className="ws-form__image-container">
                                {imagePreview || currentImage ? (
                                    <img
                                        src={imagePreview || currentImage}
                                        alt={title}
                                        className="ws-form__img"
                                    />
                                ) : (
                                    <div className="ws-form__initials">
                                        {getInitials(title)}
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
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
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
                                    className="form-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    readOnly={!isEditing}
                                    placeholder="Ej: Equipo de Desarrollo"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-textarea form-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
