import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useWorkSpaces from '../../hooks/useWorkspaces.jsx'
import ENVIRONMENT from '../../config/environment.config.js'
import './HomeScreen.css'
import { AuthContext } from '../../context/AuthContext.jsx'
import WelcomeIntro from '../../components/WelcomeIntro/WelcomeIntro.jsx'
import { FaBuilding, FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const HomeScreen = () => {
    const {
        response,
        loading,
        error,
        workspaces
    } = useWorkSpaces()

    const getInitials = (title) => {
        if (!title) return '?'
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const { user, logout, showIntro, setShowIntro } = useContext(AuthContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    console.log(user)

    return (
        <div className="home-page">
            {showIntro && <WelcomeIntro onComplete={() => setShowIntro(false)} />}

            <nav className="home-nav">
                <div className="home-nav__container">
                    <div className="home-nav__brand">
                        <span className="home-nav__logo">W</span>
                        <span className="home-nav__title">WorkChat</span>
                    </div>

                    <button
                        className={`home-nav__mobile-toggle ${isMenuOpen ? 'is-active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`home-nav__list ${isMenuOpen ? 'is-open' : ''}`}>
                        <li className="home-nav__item">
                            <Link to="/profile" className="home-nav__link" onClick={() => setIsMenuOpen(false)}>
                                <span className="home-nav__icon"><FaUser /></span>
                                Perfil
                            </Link>
                        </li>
                        <li className="home-nav__item">
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="home-nav__btn">
                                <span className="home-nav__icon"><FaSignOutAlt /></span>
                                Cerrar sesion
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className={`home-main-content ${isMenuOpen ? 'is-blurred' : ''}`}>
                <div className="home-content-container">
                    <h1 className="home-hero__title">
                        <span className="home-hero__wave">👋</span>
                        <span className="home-hero__greeting">¡Hola, {user.name}!</span>
                    </h1>
                    {loading && (
                        <div className="loading-state">
                            <span className="spinner" aria-hidden="true"></span>
                            <span>Cargando espacios de trabajo...</span>
                        </div>
                    )}

                    {!loading && response && response.ok && (workspaces?.length || 0) === 0 && (
                        <div className="empty-state">
                            <div className="empty-state__icon"><FaBuilding /></div>
                            <h2 className="empty-state__title">No tenés espacios de trabajo</h2>
                            <p className="empty-state__description">
                                Creá tu primer espacio de trabajo para empezar a colaborar con tu equipo.
                            </p>
                            <Link className="btn btn--primary" style={{ width: 'auto' }} to="/create-workspace">
                                Crear espacio de trabajo
                            </Link>
                        </div>
                    )}

                    {!loading && response && response.ok && (workspaces?.length || 0) > 0 && (
                        <>
                            <div className="home-hero">
                                <p className="home-hero__subtitle">
                                    Qué bueno verte de nuevo. <br />
                                    Elegí un espacio de trabajo para continuar.
                                </p>

                                <div className="home-hero__actions">
                                    <Link className="btn btn--primary" style={{ width: 'auto' }} to="/create-workspace">
                                        <span>+</span> Crear espacio
                                    </Link>
                                </div>
                            </div>

                            <div className="workspace-grid">
                                {workspaces.map(
                                    (workspace) => (
                                        <div className="workspace-card" key={workspace.workspace_id}>
                                            <div className="workspace-card__icon">
                                                {workspace.workspace_image ? (
                                                    <img
                                                        src={workspace.workspace_image.startsWith('http') ? workspace.workspace_image : ENVIRONMENT.API_URL + workspace.workspace_image}
                                                        alt={workspace.workspace_title}
                                                        className="workspace-card__img"
                                                    />
                                                ) : (
                                                    <div className="workspace-card__initials">
                                                        {getInitials(workspace.workspace_title)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="workspace-card__body">
                                                <h2 className="workspace-card__name">{workspace.workspace_title}</h2>
                                                <p className="workspace-card__meta">Espacio de trabajo</p>
                                                <Link
                                                    className="btn btn--workspace"
                                                    to={'/workspaces/' + workspace.workspace_id}
                                                >
                                                    Abrir espacio →
                                                </Link>
                                            </div>
                                            <button className="workspace-card__delete">
                                                <HiDotsVertical />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="empty-state">
                        <div className="empty-state__icon">⚠️</div>
                        <h2 className="empty-state__title">Error al cargar</h2>
                        <p className="empty-state__description">{error.message}</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default HomeScreen