import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../service/workspace.service.js'
import './WorkspaceScreen.css'
import ENVIRONMENT from '../../config/environment.config.js'
import { getChannelsByWorkspaceId } from '../../service/channel.service.js'
import ChannelFormModal from '../../components/ChannelFormModal/ChannelFormModal'
import MemberFormModal from '../../components/MemberFormModal/MemberFormModal'
import { FaPlus, FaCog, FaHashtag } from 'react-icons/fa'
import MessageList from '../../components/Messages/MessageList.jsx'
import MessageInput from '../../components/Messages/MessageInput.jsx'
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal'
import useMessages from '../../hooks/useMessages'
import { IoIosArrowBack } from "react-icons/io";

const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const { member_id } = useParams()
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false)
    const [channelModalMode, setChannelModalMode] = useState('create')
    const [selectedChannelForEdit, setSelectedChannelForEdit] = useState(null)

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
    const [memberModalMode, setMemberModalMode] = useState('create')
    const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)

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

    // Se calcula ANTES de llamar a useMessages porque necesitamos el ID resuelto.
    // Si el usuario entra a /workspaces/:id sin canal en la URL, channel_id es undefined
    // y selectedChannel cae en el primer canal de la lista.
    const channels = response?.data?.channels || []
    const selectedChannel = channels.find(ch => ch._id === channel_id) || channels[0]
    const effectiveChannelId = selectedChannel?._id

    const {
        messages,
        loading: messagesLoading,
        fetchMessages,
        handleRequestDelete,
        handleConfirmDelete,
        handleCloseDeleteModal,
        isDeleteModalOpen,
        deleteLoading,
    } = useMessages({ workspace_id, channel_id: effectiveChannelId })

    const handleRefresh = () => {
        sendRequest({
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
        })
    }

    useEffect(() => {
        handleRefresh()
    }, [workspace_id])

    useEffect(() => {
        fetchMessages()
        // effectiveChannelId cambia cuando: llega el canal de la URL, o cuando
        // los canales cargan y se selecciona el primero por defecto.
    }, [workspace_id, effectiveChannelId])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarVisible(false)
            } else {
                setIsSidebarVisible(true)
            }
        }
        handleResize()
    }, [])

    const handleOpenCreateChannel = (e) => {
        e?.preventDefault()
        setChannelModalMode('create')
        setSelectedChannelForEdit(null)
        setIsChannelModalOpen(true)
    }

    const handleOpenEditChannel = (e, channel) => {
        e?.preventDefault()
        e?.stopPropagation()
        setChannelModalMode('view')
        setSelectedChannelForEdit(channel)
        setIsChannelModalOpen(true)
    }

    const handleOpenInviteMember = (e) => {
        e?.preventDefault()
        setMemberModalMode('create')
        setSelectedMemberForEdit(null)
        setIsMemberModalOpen(true)
    }

    const handleOpenMember = (e, member) => {
        e?.preventDefault()
        e?.stopPropagation()
        setMemberModalMode('view')
        setSelectedMemberForEdit(member)
        setIsMemberModalOpen(true)
    }

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

    if (loading && !response) {
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
    const selectedMember = members.find(member => member.member_id === member_id)

    return (
        <div className={`workspace-layout ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
            {isSidebarVisible && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

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
                            {workspace?.workspace_role !== 'user' && (
                                <button onClick={handleOpenCreateChannel} className="btn-add-item" style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</button>
                            )}
                        </div>
                        <div className="sidebar-list">
                            {channels.map((channel) => (
                                <div key={channel._id} className="sidebar-item-container" style={{ position: 'relative' }}>
                                    <Link
                                        to={`/workspaces/${workspace_id}/${channel._id}`}
                                        className={`sidebar-item ${selectedChannel?._id === channel._id ? 'sidebar-item--active' : ''}`}
                                        onClick={() => window.innerWidth < 768 && setIsSidebarVisible(false)}
                                    >
                                        <span className="sidebar-item__icon">#</span>
                                        <span>{channel.title}</span>
                                    </Link>
                                    {workspace?.workspace_role !== 'user' && (
                                        <button
                                            className="btn-edit-channel"
                                            onClick={(e) => handleOpenEditChannel(e, channel)}
                                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', opacity: 0.6 }}
                                        >
                                            <FaCog size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section__title">
                            <span>Miembros</span>
                            {workspace?.workspace_role !== 'user' && (
                                <button onClick={handleOpenInviteMember} className="btn-add-item" style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '18px', cursor: 'pointer' }}>+</button>
                            )}
                        </div>
                        <div className="sidebar-list">
                            {members.map(member => (
                                member.member_acceptInvitation === 'accepted' && (
                                    <div key={member.member_id}>
                                        <button className='sidebar-item sidebar-item--members' onClick={(e) => handleOpenMember(e, member)}>
                                            <div className="sidebar-item__avatar-wrapper">
                                                <div className="sidebar-item__avatar">
                                                    {(member.user_name ? member.user_name[0] : 'U').toUpperCase()}
                                                </div>
                                            </div>
                                            <span>{member.user_name || 'Usuario'}</span>
                                            <span className='sidebar-member-role'>{member.member_role}</span>
                                        </button>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
                <Link className='btn btn--secondary aside' to={`/home`}>Volver al inicio</Link>
            </aside>

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
                    <Link className='btn btn--secondary header__back-btn' to={`/home`}>
                        <IoIosArrowBack />
                        <span>Inicio</span>
                    </Link>
                </header>
                {
                    channels.length === 0 ? (
                        <div className="chat-without-channels">
                            <p className="chat-messages__empty-text">No hay canales en este espacio de trabajo</p>
                            {workspace?.workspace_role !== 'user' && (
                                <button className="btn btn--primary create-channel-btn" onClick={handleOpenCreateChannel}>
                                    Crear canal
                                </button>
                            )}
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
                            <MessageList
                                messages={messages}
                                onDelete={handleRequestDelete}
                                loading={messagesLoading}
                            />
                        </div>
                    ) : null
                }

                {channels.length > 0 && selectedChannel && (
                    <div className="chat-input-container">
                        <MessageInput
                            workspace_id={workspace_id}
                            channel_id={selectedChannel._id}
                        />
                    </div>
                )}
            </main>

            <ChannelFormModal
                isOpen={isChannelModalOpen}
                mode={channelModalMode}
                channel={selectedChannelForEdit}
                workspaceId={workspace_id}
                workspaceRole={workspace?.workspace_role}
                onClose={() => setIsChannelModalOpen(false)}
                onRefresh={handleRefresh}
            />

            <MemberFormModal
                isOpen={isMemberModalOpen}
                mode={memberModalMode}
                member={selectedMemberForEdit}
                workspaceId={workspace_id}
                workspaceRole={workspace?.workspace_role}
                onClose={() => setIsMemberModalOpen(false)}
                onRefresh={handleRefresh}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Eliminar mensaje"
                message="¿Estás seguro de que querés eliminar este mensaje?"
                confirmText="Sí, eliminar"
                loading={deleteLoading}
            />
        </div>
    )
}

export default WorkspaceScreen