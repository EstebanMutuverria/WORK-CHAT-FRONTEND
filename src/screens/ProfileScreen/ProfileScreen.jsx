import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router'
import './ProfileScreen.css'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { updateUser } from '../../service/user.service.js'


const ProfileScreen = () => {

    const PROFILE_USER_FIELD_NAMES = {
        NAME: 'name',
        EMAIL: 'email',
    }
    const { user, logout, updateUserContext } = useContext(AuthContext)

    const [isEditing, setIsEditing] = useState(false)


    function onEdit() {
        setIsEditing(true)
    }

    function onSave() {
        setIsEditing(false)
    }

    function onCancel() {
        setIsEditing(false)
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
        [PROFILE_USER_FIELD_NAMES.EMAIL]: user.email
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
                const response = await updateUser(
                    formState[PROFILE_USER_FIELD_NAMES.NAME],
                    user.id
                );
                if (response.status === 200) {
                    updateUserContext({ name: response.data.user_name })
                }
                return response
            }
        })
        setIsEditing(false)
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
                                    <button type="submit" className="btn btn--primary profile-btn--save" disabled={loading}>
                                        <span>💾</span> {loading ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ProfileScreen