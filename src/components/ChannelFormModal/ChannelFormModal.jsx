import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import useForm from '../../hooks/useForm'
import { createChannel, updateChannel } from '../../service/channel.service'
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa'

const ChannelFormModal = ({ workspaceId, channel, mode = 'create', isOpen, onClose, onRefresh }) => {
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

    useEffect(() => {
        if (isOpen) {
            if (channel && mode === 'edit') {
                setFields({
                    [CHANNEL_FORM_FIELDS.TITLE]: channel.title || '',
                    [CHANNEL_FORM_FIELDS.DESCRIPTION]: channel.description || ''
                })
            } else {
                resetForm()
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
        <Modal
            isOpen={isOpen}
            onClose={() => !loading && onClose()}
            title={mode === 'create' ? 'Crear nuevo canal' : 'Editar canal'}
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>

                {error && <div className="alert alert--error">{error.message || 'Error en la operación'}</div>}
                {response && response.ok && <div className="alert alert--success">Canal {mode === 'create' ? 'creado' : 'actualizado'} con éxito.</div>}

                <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        className="btn btn--primary"
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        {mode === 'create' ? <FaPlus /> : <FaSave />}
                        {loading ? 'Procesando...' : (mode === 'create' ? 'Crear Canal' : 'Guardar Cambios')}
                    </button>
                    <button
                        className="btn btn--secondary"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default ChannelFormModal
