import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../service/workspace.service.js'
import './WorkspaceScreen.css'

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
                    requestCb: () => getWorkspaceById({ workspace_id })
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

    return (
        <div className="workspace-layout">
            {/* SIDEBAR */}
            <aside className="workspace-sidebar">
                <div className="workspace-sidebar__header">
                    <h1 className="workspace-sidebar__title">
                        {workspace ? workspace.workspace_title : 'Cargando...'}
                    </h1>
                </div>

                <div className="workspace-sidebar__scrollable">
                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Canales</span>
                        </div>
                        <div className="sidebar-list">
                            <div className="sidebar-item sidebar-item--active">
                                <span className="sidebar-item__icon">#</span>
                                <span>general</span>
                            </div>
                            <div className="sidebar-item">
                                <span className="sidebar-item__icon">#</span>
                                <span>proyectos</span>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Mensajes Directos</span>
                        </div>
                        <div className="sidebar-list">
                            {members.map(member => (
                                <div className="sidebar-item" key={member.id || member.user_id}>
                                    <div className="sidebar-item__avatar">
                                        {(member.user_name ? member.user_name[0] : 'U').toUpperCase()}
                                    </div>
                                    <span>{member.user_name || 'Usuario'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CHAT */}
            <main className="workspace-main">
                <header className="chat-header">
                    <h2 className="chat-header__title">
                        # general
                        {workspace?.workspace_description && (
                            <span className="chat-header__subtitle">
                                {workspace.workspace_description}
                            </span>
                        )}
                    </h2>
                </header>

                <div className="chat-messages">
                    <div className="chat-messages__empty">
                        <div className="chat-messages__empty-icon">👋</div>
                        <p className="chat-messages__empty-text">
                            <strong>Estás viendo el canal #general</strong><br />
                            Todavía no hay mensajes aquí. ¡Rompe el hielo y envía el primero!
                        </p>
                    </div>
                </div>

                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <textarea
                            className="chat-input"
                            placeholder="Enviar un mensaje a #general"
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