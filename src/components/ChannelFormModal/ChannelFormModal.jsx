import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import { createChannel, updateChannel } from '../../service/channel.service'
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa'

const ChannelFormModal = ({ workspaceId, channel, mode = 'create', isOpen, onClose, onRefresh }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const hasRefreshed = useRef(false)

    const { sendRequest, resetRequest, loading, error, response } = useRequest()

    useEffect(() => {
        if (isOpen) {
            if (channel && mode === 'edit') {
                setTitle(channel.title || '')
                setDescription(channel.description || '')
            } else {
                setTitle('')
                setDescription('')
            }
            hasRefreshed.current = false
            resetRequest()
        }
    }, [channel, mode, isOpen, resetRequest])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        await sendRequest({
            requestCb: () => {
                if (mode === 'create') {
                    return createChannel({ workspace_id: workspaceId, title, description })
                } else {
                    return updateChannel({ 
                        workspace_id: workspaceId, 
                        channel_id: channel._id, 
                        title, 
                        description 
                    })
                }
            }
        })
    }

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
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre del Canal</label>
                    <input
                        className="form-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: # anuncios"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción (Opcional)</label>
                    <input
                        className="form-input"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
