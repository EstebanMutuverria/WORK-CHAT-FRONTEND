import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import { createMember, updateMemberRole, deleteMember } from '../../service/member.service'
import { FaUserPlus, FaSave, FaTimes, FaPlus, FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const MemberFormModal = ({ workspaceId, workspaceRole, member, mode = 'create', isOpen, onClose, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const hasRefreshed = useRef(false)


    const { user: currentUser } = useContext(AuthContext)
    const { sendRequest, resetRequest, loading, error, response } = useRequest()

    const isMe = member?.user_id === currentUser?.id

    const handleEditToggle = (e) => {
        if (e && e.preventDefault) e.preventDefault()
        resetRequest()
        if (isEditing && mode !== 'create') {
            // Cancelar edición: resetear valores
            setEmail(member.user_email || '')
            setRole(member.member_role || '')
        }
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        if (isOpen) {
            if (member && mode !== 'create') {
                setEmail(member.user_email || '')
                setRole(member.member_role || '')
                setIsEditing(mode === 'edit')
            } else {
                setEmail('')
                setRole('')
                setIsEditing(true)
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
        <>

            <Modal
                isOpen={isOpen}
                onClose={() => !loading && onClose()}
                title={mode === 'create' ? 'Invitar Miembro' : mode === 'edit' ? 'Editar Miembro' : 'Detalles del Miembro'}
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
                            disabled={loading || mode !== 'create'}
                            readOnly={!isEditing || mode !== 'create'}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rol en el Espacio</label>
                        <select
                            className="form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            disabled={loading || !isEditing}
                        >
                            <option value="">Seleccionar rol</option>
                            <option value="admin">Administrador</option>
                            <option value="user">Usuario</option>
                            {member?.member_role === 'owner' && <option value="owner">Dueño</option>}
                        </select>
                    </div>

                    {error && <div className="alert alert--error">{error.message || 'Error en la operación'}</div>}
                    {response && response.ok && (
                        <div className="alert alert--success">
                            {mode === 'create' ? 'Invitación enviada con éxito.' : 'Rol actualizado correctamente.'}
                        </div>
                    )}

                    <div className="ws-form__actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        {!isEditing ? (
                            <>
                                {((workspaceRole === 'owner' || workspaceRole === 'admin') && !isMe && member?.member_role !== 'owner') && (
                                    <>
                                        <button type="button" className="btn btn--secondary" onClick={handleEditToggle}>
                                            <FaEdit /> Editar
                                        </button>

                                        <button type="button" className="btn btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                                            <FaTrash /> Eliminar
                                        </button>

                                    </>
                                )}
                                {(isMe && member?.member_role !== 'owner') && (
                                    <button type="button" className="btn btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                                        <FaSignOutAlt /> Salir del workspace
                                    </button>
                                )}
                                {(isMe && member?.member_role === 'owner') && (
                                    <p className="text-muted" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                        Como dueño, no puedes abandonar el espacio sin antes transferir la propiedad.
                                    </p>
                                )}
                                {(workspaceRole === 'user' && !isMe) && (
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
                                    {loading ? 'Procesando...' : (mode === 'create' ? 'Invitar Miembro' : 'Guardar Cambios')}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </Modal>

            {
                mode !== 'create' && member && (
                    <DeleteConfirmModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={async () => {
                            await sendRequest({
                                requestCb: () => deleteMember(workspaceId, member.member_id)
                            })
                            setShowDeleteConfirm(false)
                            onClose()
                        }}
                        title={isMe ? "¿Salir del espacio de trabajo?" : "¿Eliminar miembro?"}
                        message={
                            isMe ? (
                                <p>¿Seguro que quieres <strong>salir</strong> de este espacio de trabajo? Perderás acceso a todos los canales.</p>
                            ) : (
                                <p>¿Seguro que quieres eliminar a <strong>{member.user_name}</strong>? Esta acción es irreversible.</p>
                            )
                        }
                        loading={loading}
                    />
                )
            }
        </>

    )
}

export default MemberFormModal
