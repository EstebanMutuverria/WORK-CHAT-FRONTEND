import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import useForm from '../../hooks/useForm'
import { createChannel, updateChannel, deleteChannel } from '../../service/channel.service'
import { FaPlus, FaSave, FaTimes, FaTrash, FaEdit } from 'react-icons/fa'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'

const ChannelFormModal = ({ workspaceId, workspaceRole, channel, mode = 'create', isOpen, onClose, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const hasRefreshed = useRef(false)

    const CHANNEL_FORM_FIELDS = {
        TITLE: 'title',
        DESCRIPTION: 'description'
    }

    const initialFormState = {
        [CHANNEL_FORM_FIELDS.TITLE]: '',
        [CHANNEL_FORM_FIELDS.DESCRIPTION]: ''
    }

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        resetRequest, //Funcion para limpiar los estados
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    } = useForm({ initialFormState, submitFn: onSaveChannel })

    async function onSaveChannel(formState) {
        if (!formState[CHANNEL_FORM_FIELDS.TITLE].trim()) return

        await sendRequest({
            requestCb: () => {
                if (mode === 'create') {
                    return createChannel({
                        workspace_id: workspaceId,
                        title: formState[CHANNEL_FORM_FIELDS.TITLE],
                        description: formState[CHANNEL_FORM_FIELDS.DESCRIPTION]
                    })
                } else {
                    return updateChannel({
                        workspace_id: workspaceId,
                        channel_id: channel._id,
                        title: formState[CHANNEL_FORM_FIELDS.TITLE],
                        description: formState[CHANNEL_FORM_FIELDS.DESCRIPTION]
                    })
                }
            }
        })
    }

    const handleEditToggle = (e) => {
        if (e && e.preventDefault) e.preventDefault()
        resetRequest()
        if (isEditing && mode !== 'create') {
            // Cancelar edición: resetear valores
            setFields({
                [CHANNEL_FORM_FIELDS.TITLE]: channel.title || '',
                [CHANNEL_FORM_FIELDS.DESCRIPTION]: channel.description || ''
            })
        }
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        if (isOpen) {
            if (channel && mode !== 'create') {
                setFields({
                    [CHANNEL_FORM_FIELDS.TITLE]: channel.title || '',
                    [CHANNEL_FORM_FIELDS.DESCRIPTION]: channel.description || ''
                })
                setIsEditing(mode === 'edit')
            } else {
                resetForm()
                setIsEditing(true)
            }
            hasRefreshed.current = false
            resetRequest()
        }
    }, [channel, mode, isOpen, resetRequest])

    useEffect(() => {
        let timeoutId
        if (response && response.ok && !hasRefreshed.current) {
            hasRefreshed.current = true
            timeoutId = setTimeout(() => {
                onRefresh()
                onClose()
            }, 1000)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [response, onRefresh, onClose])

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => !loading && onClose()}
                title={mode === 'create' ? 'Crear nuevo canal' : mode === 'edit' ? 'Editar canal' : 'Detalles del Canal'}
            >
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor={CHANNEL_FORM_FIELDS.TITLE}>Nombre del Canal</label>
                        <input
                            className="form-input"
                            type="text"
                            id={CHANNEL_FORM_FIELDS.TITLE}
                            name={CHANNEL_FORM_FIELDS.TITLE}
                            value={formState[CHANNEL_FORM_FIELDS.TITLE]}
                            onChange={handleChangeInput}
                            placeholder="Ej: # anuncios"
                            required
                            disabled={loading || (!isEditing && mode !== 'create')}
                            readOnly={!isEditing && mode !== 'create'}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor={CHANNEL_FORM_FIELDS.DESCRIPTION}>Descripción</label>
                        <input
                            className="form-input"
                            type="text"
                            id={CHANNEL_FORM_FIELDS.DESCRIPTION}
                            name={CHANNEL_FORM_FIELDS.DESCRIPTION}
                            value={formState[CHANNEL_FORM_FIELDS.DESCRIPTION]}
                            onChange={handleChangeInput}
                            placeholder="¿De qué trata este canal?"
                            disabled={loading || (!isEditing && mode !== 'create')}
                            readOnly={!isEditing && mode !== 'create'}
                        />
                    </div>

                    {error && <div className="alert alert--error">{error.message || 'Error en la operación'}</div>}
                    {response && response.ok && (
                        <div className="alert alert--success">
                            {mode === 'create' ? 'Canal creado con éxito.' : response.message?.includes('eliminado') ? 'Canal eliminado con éxito.' : 'Canal actualizado con éxito.'}
                        </div>
                    )}

                    <div className="ws-form__actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        {!isEditing ? (
                            <>
                                {(workspaceRole === 'owner' || workspaceRole === 'admin') && (
                                    <>
                                        <button type="button" className="btn btn--secondary" onClick={handleEditToggle}>
                                            <FaEdit /> Editar
                                        </button>

                                        {workspaceRole === 'owner' && (
                                            <button type="button" className="btn btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                                                <FaTrash /> Eliminar
                                            </button>
                                        )}
                                    </>
                                )}
                                {(workspaceRole === 'user') && (
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
                                    {loading ? 'Procesando...' : (mode === 'create' ? 'Crear Canal' : 'Guardar Cambios')}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </Modal>

            {
                mode !== 'create' && channel && (
                    <DeleteConfirmModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={async () => {
                            await sendRequest({
                                requestCb: () => deleteChannel(workspaceId, channel._id)
                            })
                            setShowDeleteConfirm(false)
                        }}
                        title="¿Eliminar canal?"
                        message={
                            <p>¿Seguro que quieres eliminar el canal <strong>#{channel.title}</strong>? Esta acción es irreversible.</p>
                        }
                        loading={loading}
                    />
                )
            }
        </>
    )
}

export default ChannelFormModal

