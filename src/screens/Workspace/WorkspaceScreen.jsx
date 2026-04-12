import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../service/workspace.service.js'
import './WorkspaceScreen.css'
import { getChannelsByWorkspaceId } from '../../service/channel.service.js'

const WorkspaceScreen = () => {

    const { workspace_id } = useParams()

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

    return (
        <div className="workspace-layout">
            {/* SIDEBAR */}
            <aside className="workspace-sidebar">
                <div className="workspace-sidebar__header">
                    <h1 className="workspace-sidebar__title">
                        {workspace ? workspace.workspace_title : 'Cargando...'}
                    </h1>
                    <div className="sidebar-header__icon" style={{ opacity: 0.5 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </div>

                <div className="workspace-sidebar__scrollable">
                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Canales</span>
                            <button className="btn-add-item" style={{ color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</button>
                        </div>
                        <div className="sidebar-list">
                            {channels.map((channel, index) => (
                                <Link
                                    to={`/workspace/${workspace_id}/channel/${channel._id}`}
                                    key={channel._id}
                                    className={`sidebar-item ${index === 0 ? 'sidebar-item--active' : ''}`}
                                >
                                    <span className="sidebar-item__icon">#</span>
                                    <span>{channel.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Mensajes Directos</span>
                            <button className="btn-add-item" style={{ color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</button>
                        </div>
                        <div className="sidebar-list">
                            {members.map(member => (
                                <div className="sidebar-item" key={member.id || member.user_id}>
                                    <div className="sidebar-item__avatar-wrapper">
                                        <div className="sidebar-item__avatar">
                                            {(member.user_name ? member.user_name[0] : 'U').toUpperCase()}
                                        </div>
                                        <span className={`presence-dot ${Math.random() > 0.3 ? 'presence-dot--online' : 'presence-dot--offline'}`}></span>
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
                    <h2 className="chat-header__title">
                        <span>#</span> general
                        {workspace?.workspace_description && (
                            <span className="chat-header__subtitle">
                                {workspace.workspace_description}
                            </span>
                        )}
                    </h2>
                </header>

                {channels.map(channel => (
                    <div className="chat-messages" key={channel._id}>
                        <div className="chat-messages__empty">
                            <div className="chat-messages__empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div className="chat-messages__empty-text">
                                <strong>Bienvenido a #{channel.title}</strong>
                                <p>
                                    Este es el comienzo de la historia de este canal.
                                    Úsalo para comunicarte con tu equipo, compartir ideas y colaborar.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <textarea
                            className="chat-input"
                            placeholder="Escribe un mensaje en #general"
                            rows={1}
                        ></textarea>
                        <div className="chat-input-actions">
                            <button className="btn-send">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default WorkspaceScreen