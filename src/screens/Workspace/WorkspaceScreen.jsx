import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../service/workspace.service.js'
import './WorkspaceScreen.css'
import ENVIRONMENT from '../../config/environment.config.js'
import { getChannelsByWorkspaceId } from '../../service/channel.service.js'

const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    const getInitials = (title) => {
        if (!title) return '?'
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const {
        sendRequest,
        response,
        error,
        loading
    } = useRequest()

    useEffect(
        () => {
            sendRequest(
                {
                    requestCb: async () => {
                        const [workspaceResponse, channelsResponse] = await Promise.all([
                            getWorkspaceById({ workspace_id }),
                            getChannelsByWorkspaceId({ workspace_id })
                        ])
                        return {
                            ...workspaceResponse,
                            data: {
                                ...workspaceResponse.data,
                                channels: channelsResponse.data.channels
                            }
                        }
                    }
                }
            )
        },
        [workspace_id]
    )

    // Automatically hide sidebar on small screens on initial load
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarVisible(false)
            } else {
                setIsSidebarVisible(true)
            }
        }
        handleResize() // Set initial state
        // We don't necessarily want to toggle it every time window resizes if user manually changed it, 
        // but for a first implementation this is fine.
    }, [])

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

    if (loading) {
        return (
            <div className="workspace-full-state">
                <div className="loading-state">
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Cargando espacio de trabajo...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="workspace-full-state">
                <div className="empty-state">
                    <div className="empty-state__icon">⚠️</div>
                    <h2 className="empty-state__title">Error al cargar</h2>
                    <p className="empty-state__description">{error.message || 'Ocurrió un error desconocido'}</p>
                    <Link className="btn btn--primary" to="/home" style={{ marginTop: '1rem', width: 'auto' }}>
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        )
    }

    const workspace = response?.data?.workspace
    const members = response?.data?.members || []
    const channels = response?.data?.channels || []

    const selectedChannel = channels.find(channel => channel._id === channel_id) || channels[0]


    return (
        <div className={`workspace-layout ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
            {/* SIDEBAR OVERLAY (Mobile) */}
            {isSidebarVisible && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            {/* SIDEBAR */}
            <aside className={`workspace-sidebar ${isSidebarVisible ? 'visible' : ''}`}>
                <div className="workspace-sidebar__header">
                    <div className="sidebar-header__workspace-icon">
                        {workspace?.workspace_image ? (
                            <img
                                src={workspace.workspace_image.startsWith('http') ? workspace.workspace_image : ENVIRONMENT.API_URL + workspace.workspace_image}
                                alt={workspace.workspace_title}
                                className="sidebar-workspace-img"
                            />
                        ) : (
                            <div className="sidebar-workspace-initials">
                                {getInitials(workspace?.workspace_title)}
                            </div>
                        )}
                    </div>
                    <h1 className="workspace-sidebar__title">
                        {workspace ? workspace.workspace_title : 'Cargando...'}
                    </h1>
                    <div className="sidebar-header__hide-icon" onClick={toggleSidebar}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                <div className="workspace-sidebar__scrollable">
                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Canales</span>
                            <Link to={`/workspaces/${workspace_id}/create-channel`} className="btn-add-item" style={{ color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</Link>
                        </div>
                        <div className="sidebar-list">
                            {channels.map((channel) => (
                                <Link
                                    to={`/workspaces/${workspace_id}/${channel._id}`}
                                    key={channel._id}
                                    className={`sidebar-item ${selectedChannel?._id === channel._id ? 'sidebar-item--active' : ''}`}
                                    onClick={() => window.innerWidth < 768 && setIsSidebarVisible(false)}
                                >
                                    <span className="sidebar-item__icon">#</span>
                                    <span>{channel.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Miembros</span>
                            <Link to={`/workspaces/${workspace_id}/create-member`} className="btn-add-item" style={{ color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</Link>
                        </div>
                        <div className="sidebar-list">
                            {members.map(member => (
                                <div className="sidebar-item" key={member.member_id}>
                                    <div className="sidebar-item__avatar-wrapper">
                                        <div className="sidebar-item__avatar">
                                            {(member.user_name ? member.user_name[0] : 'U').toUpperCase()}
                                        </div>
                                        {/*  <span className={`presence-dot ${Math.random() > 0.3 ? 'presence-dot--online' : 'presence-dot--offline'}`}></span> */}
                                    </div>
                                    <span>{member.user_name || 'Usuario'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Link className='btn btn--secondary aside' to={`/home`}>Volver al inicio</Link>
            </aside>

            {/* MAIN CHAT */}
            <main className="workspace-main">
                <header className="chat-header">
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    {selectedChannel && (
                        <h2 className="chat-header__title">
                            <span>#</span> {selectedChannel.title}
                            {selectedChannel?.channel_description && (
                                <span className="chat-header__subtitle">
                                    {selectedChannel.channel_description}
                                </span>
                            )}
                        </h2>
                    )}
                </header>
                {
                    channels.length === 0 ? (
                        <div className="chat-without-channels">
                            <p className="chat-messages__empty-text">No hay canales en este espacio de trabajo</p>
                            <Link className="btn btn--primary create-channel-btn" to={`/workspaces/${workspace_id}/create-channel`}>
                                Crear canal
                            </Link>
                        </div>
                    ) : selectedChannel ? (
                        <div className="chat-messages" key={selectedChannel._id}>
                            <div className="chat-messages__empty">
                                <div className="chat-messages__empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className="chat-messages__empty-text">
                                    <strong>Bienvenido a #{selectedChannel.title}</strong>
                                    <p>
                                        Este es el comienzo de la historia de este canal.
                                        Úsalo para comunicarte con tu equipo, compartir ideas y colaborar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null
                }

                {channels.length > 0 && (
                    <div className="chat-input-container">
                        <div className="chat-input-wrapper">
                            <textarea
                                className="chat-input"
                                placeholder={`Escribe un mensaje en #${selectedChannel?.title || ''}`}
                                rows={1}
                            ></textarea>
                            <div className="chat-input-actions">
                                <button className="btn-send">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default WorkspaceScreen