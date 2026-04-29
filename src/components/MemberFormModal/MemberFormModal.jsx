import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import Modal from '../Modal/Modal'
import useRequest from '../../hooks/useRequest'
import useForm from '../../hooks/useForm'
import { createMember, updateMemberRole, deleteMember } from '../../service/member.service'
import { FaUserPlus, FaSave, FaTimes, FaPlus, FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const MemberFormModal = ({ workspaceId, workspaceRole, member, mode = 'create', isOpen, onClose, onRefresh }) => {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const hasRefreshed = useRef(false)

    const MEMBER_FORM_FIELDS = {
        EMAIL: 'email',
        ROLE: 'role'
    }

    const { user: currentUser } = useContext(AuthContext)

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        resetRequest, //Funcion para limpiar los estados
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const isMe = member?.user_id === currentUser?.id

    const initialFormState = {
        [MEMBER_FORM_FIELDS.EMAIL]: '',
        [MEMBER_FORM_FIELDS.ROLE]: ''
    }

    const {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    } = useForm({ initialFormState, submitFn: onSaveMember })

    async function onSaveMember(formState) {
        if (mode === 'create' && !formState[MEMBER_FORM_FIELDS.EMAIL].trim()) return
        if (!formState[MEMBER_FORM_FIELDS.ROLE]) return

        await sendRequest({
            requestCb: () => {
                if (mode === 'create') {
                    return createMember(workspaceId, formState[MEMBER_FORM_FIELDS.EMAIL], formState[MEMBER_FORM_FIELDS.ROLE])
                } else {
                    return updateMemberRole(workspaceId, member.member_id, formState[MEMBER_FORM_FIELDS.ROLE])
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
                [MEMBER_FORM_FIELDS.EMAIL]: member.user_email || '',
                [MEMBER_FORM_FIELDS.ROLE]: member.member_role || ''
            })
        }
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        if (isOpen) {
            if (member && mode !== 'create') {
                setFields({
                    [MEMBER_FORM_FIELDS.EMAIL]: member.user_email || '',
                    [MEMBER_FORM_FIELDS.ROLE]: member.member_role || ''
                })
                setIsEditing(mode === 'edit')
            } else {
                resetForm()
                setIsEditing(true)
            }
            hasRefreshed.current = false
            resetRequest()
        }
    }, [member, mode, isOpen, resetRequest])

    useEffect(() => {
        let timeoutId
        if (response && response.ok && !hasRefreshed.current) {
            hasRefreshed.current = true
            timeoutId = setTimeout(() => {
                if (isMe) {
                    navigate('/home')
                } else {
                    onRefresh()
                }
                onClose()
            }, 1000)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [response, onRefresh, onClose, isMe, navigate])

    return (
        <>

            <Modal
                isOpen={isOpen}
                onClose={() => !loading && onClose()}
                title={mode === 'create' ? 'Invitar Miembro' : mode === 'edit' ? 'Editar Miembro' : 'Detalles del Miembro'}
            >
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor={MEMBER_FORM_FIELDS.EMAIL}>Email del Usuario</label>
                        <input
                            className="form-input"
                            type="email"
                            id={MEMBER_FORM_FIELDS.EMAIL}
                            name={MEMBER_FORM_FIELDS.EMAIL}
                            value={formState[MEMBER_FORM_FIELDS.EMAIL]}
                            onChange={handleChangeInput}
                            placeholder="ejemplo@correo.com"
                            required
                            disabled={loading || mode !== 'create'}
                            readOnly={!isEditing || mode !== 'create'}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor={MEMBER_FORM_FIELDS.ROLE}>Rol en el Espacio</label>
                        <select
                            className="form-input"
                            id={MEMBER_FORM_FIELDS.ROLE}
                            name={MEMBER_FORM_FIELDS.ROLE}
                            value={formState[MEMBER_FORM_FIELDS.ROLE]}
                            onChange={handleChangeInput}
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
                                {isMe && (
                                    <button type="button" className="btn btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                                        <FaSignOutAlt /> Salir del workspace
                                    </button>
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
                                member?.member_role === 'owner' ? (
                                    <p>Como <strong>dueño</strong>, al salir se transferirá la propiedad automáticamente al miembro más antiguo o si eres el unico miembro se eliminará el espacio de trabajo automaticamente. ¿Deseas continuar?</p>
                                ) : (
                                    <p>¿Seguro que quieres <strong>salir</strong> de este espacio de trabajo? Perderás acceso a todos los canales.</p>
                                )
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
