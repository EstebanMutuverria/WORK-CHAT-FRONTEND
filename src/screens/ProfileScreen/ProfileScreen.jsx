import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router'
import './ProfileScreen.css'

const PROFILE_USER_FIELD_NAMES = {
    NAME: 'name',
    EMAIL: 'email',
}

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext)

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

                    <div className="profile-info">
                        <div className="profile-field">
                            <label className="profile-field__label" htmlFor={PROFILE_USER_FIELD_NAMES.NAME}>Nombre</label>
                            <div className="profile-field__value">{user.name}</div>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field__label" htmlFor={PROFILE_USER_FIELD_NAMES.EMAIL}>Correo electrónico</label>
                            <div className="profile-field__value">{user.email}</div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn profile-btn--logout" onClick={logout}>
                            <span>👋</span> Cerrar sesión
                        </button>
                        <Link to="/home" className="profile-link--back">
                            <span>←</span> Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfileScreen