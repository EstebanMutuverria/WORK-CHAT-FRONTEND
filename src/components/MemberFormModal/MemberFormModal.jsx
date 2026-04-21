import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import { createMember, updateMemberRole } from '../../service/member.service'
import { FaUserPlus, FaSave, FaTimes } from 'react-icons/fa'

const MemberFormModal = ({ workspaceId, member, mode = 'create', isOpen, onClose, onRefresh }) => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const hasRefreshed = useRef(false)

    const { sendRequest, resetRequest, loading, error, response } = useRequest()

    useEffect(() => {
        if (isOpen) {
            if (member && mode === 'edit') {
                setEmail(member.user_email || '')
                setRole(member.member_role || '')
            } else {
                setEmail('')
                setRole('')
            }
            hasRefreshed.current = false
            resetRequest()
        }
    }, [member, mode, isOpen, resetRequest])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (mode === 'create' && !email.trim()) return
        if (!role) return

        await sendRequest({
            requestCb: () => {
                if (mode === 'create') {
                    return createMember(workspaceId, email, role)
                } else {
                    return updateMemberRole(workspaceId, member.member_id, role)
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
            title={mode === 'create' ? 'Invitar Miembro' : 'Editar Miembro'}
        >
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email del Usuario</label>
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                        disabled={loading || mode === 'edit'}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Rol en el Espacio</label>
                    <select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        disabled={loading}
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                    </select>
                </div>

                {error && <div className="alert alert--error">{error.message || 'Error en la operación'}</div>}
                {response && response.ok && (
                    <div className="alert alert--success">
                        {mode === 'create' ? 'Invitación enviada con éxito.' : 'Rol actualizado correctamente.'}
                    </div>
                )}

                <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        className="btn btn--primary"
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        {mode === 'create' ? <FaUserPlus /> : <FaSave />}
                        {loading ? 'Procesando...' : (mode === 'create' ? 'Enviar Invitación' : 'Guardar Cambios')}
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

export default MemberFormModal
