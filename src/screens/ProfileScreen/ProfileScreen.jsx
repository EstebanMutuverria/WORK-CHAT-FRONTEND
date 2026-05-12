import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router'
import './ProfileScreen.css'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { updateUser, deleteUser } from '../../service/user.service.js'
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal'
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";


const ProfileScreen = () => {

    const PROFILE_USER_FIELD_NAMES = {
        NAME: 'name',
        EMAIL: 'email',
        GITHUB: 'github',
        LINKEDIN: 'linkedin',
        TWITTER: 'twitter',
        INSTAGRAM: 'instagram'
    }
    const { user, logout, updateUserContext, updateToken } = useContext(AuthContext)

    const [isEditing, setIsEditing] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


    function onEdit() {
        resetRequest()
        setIsEditing(true)
    }

    function onSave() {
        setIsEditing(false)
    }

    function onCancel() {
        setIsEditing(false)
        setFields(initialFormState)
    }

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        resetRequest, //Funcion para limpiar los estados
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const initialFormState = {
        [PROFILE_USER_FIELD_NAMES.NAME]: user.name,
        [PROFILE_USER_FIELD_NAMES.EMAIL]: user.email,
        [PROFILE_USER_FIELD_NAMES.GITHUB]: user.github || '',
        [PROFILE_USER_FIELD_NAMES.LINKEDIN]: user.linkedin || '',
        [PROFILE_USER_FIELD_NAMES.TWITTER]: user.twitter || '',
        [PROFILE_USER_FIELD_NAMES.INSTAGRAM]: user.instagram || ''
    }

    const {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    } = useForm({ initialFormState, submitFn: onSaveProfile })

    async function onSaveProfile(formState) {
        await sendRequest({
            requestCb: async () => {
                const response = await updateUser(formState, user.id);
                if (response.status === 200) {
                    updateToken(response.data.auth_token)
                }
                return response
            }
        })
        setIsEditing(false)
    }

    async function handleDeleteAccount() {
        await sendRequest({
            requestCb: async () => {
                const response = await deleteUser(user.id)
                if (response.ok) {
                    logout()
                }
                return response
            }
        })
        setIsDeleteModalOpen(false)
    }

    // Function to get user initials for the avatar
    const getInitials = (name) => {
        if (!name) return '?'
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const SOCIAL_FIELD_CONFIG = [
        {
            id: 1,
            name: PROFILE_USER_FIELD_NAMES.GITHUB,
            label: 'Github',
            type: 'url',
            icon: <FaGithub />
        },
        {
            id: 2,
            name: PROFILE_USER_FIELD_NAMES.LINKEDIN,
            label: 'Linkedin',
            type: 'url',
            icon: <CiLinkedin />
        },
        {
            id: 3,
            name: PROFILE_USER_FIELD_NAMES.TWITTER,
            label: 'Twitter',
            type: 'url',
            icon: <FaXTwitter />
        },
        {
            id: 4,
            name: PROFILE_USER_FIELD_NAMES.INSTAGRAM,
            label: 'Instagram',
            type: 'url',
            icon: <FaInstagram />
        }
    ]

    return (
        <div className="profile-page">
            <header className="home-nav">
                <div className="home-nav__container">
                    <div className="home-nav__brand">
                        <Link to="/home" className="home-nav__logo">W</Link>
                        <span className="home-nav__title">WorkChat</span>
                    </div>
                </div>
            </header>

            <main className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-header__title">Tu perfil</h1>
                    <p className="text-muted">Gestiona tu información personal</p>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        {getInitials(user.name)}
                    </div>

                    <form className="profile-info" onSubmit={onSubmit}>
                        <div className="profile-field">
                            <label className="profile-field__label" htmlFor={PROFILE_USER_FIELD_NAMES.NAME}>Nombre</label>
                            <input type="text" className={`profile-field__value ${!isEditing ? 'profile-field__disabled' : ''}`} value={formState[PROFILE_USER_FIELD_NAMES.NAME]} onChange={handleChangeInput} name={PROFILE_USER_FIELD_NAMES.NAME} disabled={!isEditing} />
                        </div>

                        <div className="profile-field">
                            <label className="profile-field__label" htmlFor={PROFILE_USER_FIELD_NAMES.EMAIL}>Correo electrónico</label>
                            <input type="email" className="profile-field__value profile-field__disabled" value={user.email} disabled />
                        </div>
                        {
                            SOCIAL_FIELD_CONFIG.map((field) => (
                                <div className="profile-field" key={field.id}>
                                    <label className="profile-field__label" htmlFor={field.name}>{field.label}</label>
                                    <div className={`profile-field__social-input ${!isEditing ? 'profile-field__social-input--disabled' : ''}`}>
                                        <span className={`profile-field__social-icon ${!isEditing ? 'profile-field__social-icon--disabled' : ''}`}>{field.icon}</span>
                                        {
                                            isEditing ? (
                                                <input type="url" className={`profile-field__value ${!isEditing ? 'profile-field__disabled' : ''}`} value={formState[field.name]} onChange={handleChangeInput} name={field.name} disabled={!isEditing} />
                                            ) : (
                                                formState[field.name] ? (
                                                    <a href={formState[field.name] || '#'} target="_blank" rel="noopener noreferrer" className={`profile-field__value ${!isEditing ? 'profile-field__disabled' : ''}`} value={formState[field.name]} onChange={handleChangeInput} name={field.name} disabled={!isEditing}>{formState[field.name]}</a>
                                                ) : (
                                                    <span className={`profile-field__value ${!isEditing ? 'profile-field__disabled' : ''}`}>Sin configurar</span>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <div className="profile-feedback">
                            {
                                error && (
                                    <div className="alert alert--error">
                                        {error.message || 'Error al actualizar el perfil'}
                                    </div>
                                )
                            }
                            {
                                response && !response.ok && (
                                    <div className="alert alert--error">
                                        {response.message || 'Error al actualizar el perfil'}
                                    </div>
                                )
                            }
                            {
                                response && response.ok && (
                                    <div className="alert alert--success">
                                        {response.message || 'Perfil actualizado correctamente'}
                                    </div>
                                )
                            }
                        </div>

                        <div className="profile-actions">
                            {!isEditing ? (
                                <>
                                    <button type="button" className="btn btn--secondary profile-btn--edit" onClick={onEdit}>
                                        <span>✏️</span> Editar perfil
                                    </button>
                                    <button type="button" className="btn btn--danger profile-btn--logout" onClick={logout}>
                                        <span>👋</span> Cerrar sesión
                                    </button>
                                    <Link to="/home" className="profile-link--back">
                                        <span>←</span> Volver al inicio
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button type="button" className="btn btn--secondary profile-btn--cancel" onClick={onCancel}>
                                        <span>X</span> Cancelar
                                    </button>
                                    <button type="submit" className="btn btn--primary profile-btn--save" disabled={loading || formState[PROFILE_USER_FIELD_NAMES.NAME] === ''}>
                                        <span>💾</span> {loading ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>

                <div className="profile-card danger-zone">
                    <div className="danger-zone__content">
                        <div className="danger-zone__text">
                            <h2 className="danger-zone__title">Zona de peligro</h2>
                            <p className="danger-zone__description">
                                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn btn--danger-solid profile-btn--delete"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <span>🗑️</span> Eliminar mi cuenta
                        </button>
                    </div>
                </div>

                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteAccount}
                    title="¿Eliminar tu cuenta permanentemente?"
                    message={
                        <>
                            <p>Estás a punto de eliminar tu cuenta de <strong>WorkChat</strong>.</p>
                            <p>Si eres el único propietario de algún espacio de trabajo, este se eliminará. Si hay otros miembros, la propiedad se transferirá automáticamente.</p>
                        </>
                    }
                    confirmText="Sí, eliminar cuenta"
                    loading={loading}
                />
            </main>
        </div>
    )
}

export default ProfileScreen