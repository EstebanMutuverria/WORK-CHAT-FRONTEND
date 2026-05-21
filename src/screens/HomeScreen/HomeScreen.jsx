import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useWorkSpaces from '../../hooks/useWorkspaces.jsx'
import ENVIRONMENT from '../../config/environment.config.js'
import './HomeScreen.css'
import { AuthContext } from '../../context/AuthContext.jsx'
import WelcomeIntro from '../../components/WelcomeIntro/WelcomeIntro.jsx'
import { FaBuilding, FaUser, FaUsers } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import WorkspaceFormModal from '../../components/WorkspaceFormModal/WorkspaceFormModal.jsx'
import FriendsModal from '../../components/FriendsModal/FriendsModal.jsx'
import { getPendingRequests } from '../../service/friendship.service.js'


const HomeScreen = () => {
    const {
        response,
        loading,
        error,
        workspaces,
        refetch
    } = useWorkSpaces()

    const getInitials = (t) => {
        if (!t) return '?'
        return t.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }

    const { user, logout, showIntro, setShowIntro } = useContext(AuthContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)

    // Obtener la cantidad de solicitudes pendientes para el badge del navbar
    const fetchPendingCount = async () => {
        try {
            const res = await getPendingRequests()
            if (res.ok) {
                setPendingCount(res.data.length)
            }
        } catch (err) {
            // Si falla, simplemente no mostramos badge
            setPendingCount(0)
        }
    }

    useEffect(() => {
        fetchPendingCount()
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const handleOpenSettings = (e, workspace) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedWorkspace(workspace)
        setModalMode('view')
        setIsModalOpen(true)
    }

    const handleCreateWorkspace = (e) => {
        e.preventDefault()
        setSelectedWorkspace(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

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
                            <button 
                                onClick={() => { setIsFriendsModalOpen(true); setIsMenuOpen(false); }} 
                                className="home-nav__btn home-nav__btn--friends"
                            >
                                <span className="home-nav__icon"><FaUsers /></span>
                                Amigos
                                {pendingCount > 0 && (
                                    <span className="home-nav__badge">{pendingCount}</span>
                                )}
                            </button>
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
                            <button className="btn btn--primary" style={{ width: 'auto' }} onClick={handleCreateWorkspace}>
                                Crear espacio de trabajo
                            </button>
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
                                    <button className="btn btn--primary" style={{ width: 'auto' }} onClick={handleCreateWorkspace}>
                                        <span>+</span> Crear espacio
                                    </button>
                                </div>
                            </div>

                            <div className="workspace-grid">
                                {workspaces.map((workspace) => (
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
                                        <button
                                            className="settings-card-btn"
                                            onClick={(e) => handleOpenSettings(e, workspace)}
                                        >
                                            <HiDotsVertical />
                                        </button>
                                    </div>
                                ))}
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

            <WorkspaceFormModal
                isOpen={isModalOpen}
                mode={modalMode}
                workspace={selectedWorkspace}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedWorkspace(null)
                }}
                onRefresh={refetch}
            />

            <FriendsModal
                isOpen={isFriendsModalOpen}
                onClose={() => {
                    setIsFriendsModalOpen(false)
                    fetchPendingCount() // Refrescamos el badge al cerrar el modal
                }}
            />

        </div>
    )
}

export default HomeScreen