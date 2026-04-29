import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
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
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const hasRefreshed = useRef(false)
    const fileInputRef = useRef(null)

    const WORKSPACE_FORM_FIELDS = {
        TITLE: 'title',
        DESCRIPTION: 'description',
        IMAGE: 'image',
        IMAGE_PREVIEW: 'imagePreview'
    }

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        resetRequest, //Funcion para limpiar los estados
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const initialFormState = {
        [WORKSPACE_FORM_FIELDS.TITLE]: '',
        [WORKSPACE_FORM_FIELDS.DESCRIPTION]: '',
        [WORKSPACE_FORM_FIELDS.IMAGE]: null,
        [WORKSPACE_FORM_FIELDS.IMAGE_PREVIEW]: null
    }

    const {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    } = useForm({ initialFormState, submitFn: onSaveWorkspace })

    async function onSaveWorkspace(formState) {
        if (mode === 'create' || !workspace) {
            await sendRequest({
                requestCb: () => createWorkspace({
                    title: formState[WORKSPACE_FORM_FIELDS.TITLE],
                    description: formState[WORKSPACE_FORM_FIELDS.DESCRIPTION],
                    image: formState[WORKSPACE_FORM_FIELDS.IMAGE]
                })
            })
        } else {
            await sendRequest({
                requestCb: () => updateWorkspace({
                    workspace_id: workspace.workspace_id,
                    title: formState[WORKSPACE_FORM_FIELDS.TITLE],
                    description: formState[WORKSPACE_FORM_FIELDS.DESCRIPTION],
                    image: formState[WORKSPACE_FORM_FIELDS.IMAGE],
                })
            })
        }
    }

    // Sincronizar estado con el workspace recibido o resetear para creación
    useEffect(() => {
        if (isOpen) {
            if (workspace && mode !== 'create') {
                setFields({
                    [WORKSPACE_FORM_FIELDS.TITLE]: workspace.workspace_title || '',
                    [WORKSPACE_FORM_FIELDS.DESCRIPTION]: workspace.workspace_description || '',
                    [WORKSPACE_FORM_FIELDS.IMAGE]: null,
                    [WORKSPACE_FORM_FIELDS.IMAGE_PREVIEW]: null
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
                [WORKSPACE_FORM_FIELDS.TITLE]: workspace.workspace_title || '',
                [WORKSPACE_FORM_FIELDS.DESCRIPTION]: workspace.workspace_description || '',
                [WORKSPACE_FORM_FIELDS.IMAGE]: null,
                [WORKSPACE_FORM_FIELDS.IMAGE_PREVIEW]: null
            })
        }
        setIsEditing(!isEditing)
    }

    // Efecto para manejar el éxito
    useEffect(() => {
        let timeoutId
        if (response && response.ok && !hasRefreshed.current) {
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

        if (!response) {
            hasRefreshed.current = false
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [response, onRefresh, onClose, mode])

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
                    if (!loading) onClose()
                }}
                title={modalTitle}
            >
                <div className="ws-form">
                    <form onSubmit={onSubmit}>
                        <div className="ws-form__header">
                            <div className="ws-form__image-container">
                                {formState[WORKSPACE_FORM_FIELDS.IMAGE_PREVIEW] || currentImage ? (
                                    <img
                                        src={formState[WORKSPACE_FORM_FIELDS.IMAGE_PREVIEW] || currentImage}
                                        alt={formState[WORKSPACE_FORM_FIELDS.TITLE]}
                                        className="ws-form__img"
                                    />
                                ) : (
                                    <div className="ws-form__initials">
                                        {getInitials(formState[WORKSPACE_FORM_FIELDS.TITLE])}
                                    </div>
                                )}

                                {isEditing && (
                                    <button
                                        className="ws-form__image-edit"
                                        onClick={() => fileInputRef.current.click()}
                                        type="button"
                                        disabled={loading}
                                    >
                                        <FaCamera />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    name={WORKSPACE_FORM_FIELDS.IMAGE}
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
                                <label className="form-label" htmlFor={WORKSPACE_FORM_FIELDS.TITLE}>Nombre del Espacio</label>
                                <input
                                    type="text"
                                    id={WORKSPACE_FORM_FIELDS.TITLE}
                                    name={WORKSPACE_FORM_FIELDS.TITLE}
                                    className="form-input"
                                    value={formState[WORKSPACE_FORM_FIELDS.TITLE]}
                                    onChange={handleChangeInput}
                                    readOnly={!isEditing}
                                    placeholder="Ej: Equipo de Desarrollo"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor={WORKSPACE_FORM_FIELDS.DESCRIPTION}>Descripción</label>
                                <textarea
                                    id={WORKSPACE_FORM_FIELDS.DESCRIPTION}
                                    name={WORKSPACE_FORM_FIELDS.DESCRIPTION}
                                    className="form-textarea form-input"
                                    value={formState[WORKSPACE_FORM_FIELDS.DESCRIPTION]}
                                    onChange={handleChangeInput}
                                    readOnly={!isEditing}
                                    placeholder="¿Misión del equipo?"
                                    rows="3"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="alert alert--error">{error.message || 'Error en la operación'}</div>}
                        {response && response.ok && (
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
                                        <button type="button" className="btn btn--secondary" onClick={handleEditToggle} disabled={loading}>
                                            <FaTimes /> Cancelar
                                        </button>
                                    )}
                                    <button type="submit" className="btn btn--primary" disabled={loading}>
                                        {mode === 'create' ? <FaPlus /> : <FaSave />}
                                        {loading ? 'Procesando...' : (mode === 'create' ? 'Crear Espacio' : 'Guardar Cambios')}
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
                        await sendRequest({
                            requestCb: () => deleteWorkspace({ workspace_id: workspace.workspace_id })
                        })
                        setShowDeleteConfirm(false)
                        // Si estamos dentro de un workspace, redirigir al home al eliminarlo
                        if (window.location.pathname.includes(`/workspaces/${workspace.workspace_id}`)) {
                            navigate('/home')
                        }
                        onClose()
                    }}
                    title="¿Eliminar espacio?"
                    message={<p>¿Seguro que quieres borrar <strong>{workspace.workspace_title}</strong>? Esta acción es irreversible.</p>}
                    loading={loading}
                />
            )}
        </>
    )
}

export default WorkspaceFormModal
