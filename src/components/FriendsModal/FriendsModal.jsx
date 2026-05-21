import React, { useEffect, useState, useContext } from 'react'
import Modal from '../Modal/Modal'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'
import useFriends from '../../hooks/useFriends'
import { AuthContext } from '../../context/AuthContext'
import { FaUsers, FaUserClock, FaUserPlus, FaTrash, FaCheck, FaTimes, FaEnvelope, FaInfoCircle } from 'react-icons/fa'
import './FriendsModal.css'

/**
 * Componente FriendsModal:
 * Gestiona de forma visual toda la interacción de amigos (lista de amigos aceptados,
 * solicitudes de amistad pendientes recibidas y envío de nuevas solicitudes por email).
 * 
 * En lugar de utilizar window.confirm, utiliza el componente preexistente DeleteConfirmModal
 * para dar una experiencia premium y segura al eliminar amigos.
 */
const FriendsModal = ({ isOpen, onClose }) => {
    // 1. Estados Locales del Modal
    const [activeTab, setActiveTab] = useState('friends') // Controla la pestaña activa ('friends', 'pending', 'add')
    const [emailInput, setEmailInput] = useState('') // Guarda el correo escrito en la pestaña "Agregar amigo"

    // Estados específicos para controlar el modal de confirmación de eliminación
    const [isDeleteOpen, setIsDeleteOpen] = useState(false) // Si el DeleteConfirmModal está visible
    const [friendshipToDelete, setFriendshipToDelete] = useState(null) // La relación de amistad específica que se desea romper

    // 2. Consumo de Contextos y Hooks
    const { user } = useContext(AuthContext) // Obtenemos el usuario en sesión para saber cuál extremo de la relación somos

    // Desestructuramos todos los estados y métodos expuestos por nuestro hook personalizado useFriends
    const {
        friends,
        pendingRequest,
        loading,
        error,
        succes, // Nota: Se conserva el nombre de la variable 'succes' (con una sola 's' al final) para coincidir con el hook
        fetchFriends,
        fetchPendingRequests,
        sendFriendship,
        acceptRequest,
        rejectRequest,
        removeFriend,
        clearMessages
    } = useFriends()

    // 3. Efecto de carga inicial
    // Cada vez que se abre el modal (isOpen cambia a true), queremos asegurarnos de:
    // a) Traer la lista actualizada de amigos aceptados.
    // b) Traer la lista actualizada de solicitudes de amistad pendientes.
    // c) Limpiar los mensajes residuales de éxito o error que hayan quedado del uso anterior.
    // d) Restablecer el tab activo en la pestaña principal de amigos.
    useEffect(() => {
        if (isOpen) {
            fetchFriends()
            fetchPendingRequests()
            clearMessages()
            setActiveTab('friends')
            setEmailInput('')
        }
    }, [isOpen, fetchFriends, fetchPendingRequests, clearMessages])

    // 4. Funciones Auxiliares / Helpers

    /**
     * getFriendDetails:
     * El backend almacena las relaciones de amistad con dos campos: 'requester' y 'recipient'.
     * Para mostrar la tarjeta del amigo de forma correcta en la UI, necesitamos determinar
     * cuál de los dos extremos es el amigo.
     * Si yo inicié la solicitud (soy el 'requester'), entonces mi amigo es el 'recipient'.
     * Si me la enviaron a mí, entonces mi amigo es el 'requester'.
     */
    const getFriendDetails = (friendship) => {
        if (!friendship || !user) return null
        return friendship.requester._id === user.id ? friendship.recipient : friendship.requester
    }

    /**
     * getInitials:
     * Genera las iniciales para los avatares circulares del modal a partir del nombre.
     * Ej: "Esteban Mutuverria" -> "EM"
     */
    const getInitials = (name) => {
        if (!name) return '?'
        return name
            .split(' ')
            .filter(Boolean)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // 5. Gestores de Eventos (Event Handlers)

    // Envía la solicitud de amistad en la pestaña "Agregar amigo"
    const handleSendRequest = async (e) => {
        e.preventDefault()
        if (!emailInput.trim()) return

        // Ejecutamos la función del hook. Si se completa con éxito, limpiamos el campo de texto.
        const isSuccess = await sendFriendship(emailInput.trim())
        if (isSuccess) {
            setEmailInput('')
        }
    }

    // Abre el modal de confirmación guardando en el estado la amistad que queremos eliminar
    const handleOpenDelete = (friendship) => {
        setFriendshipToDelete(friendship)
        setIsDeleteOpen(true)
    }

    // Se ejecuta al dar clic en el botón de confirmación del DeleteConfirmModal
    const handleConfirmDelete = async () => {
        if (!friendshipToDelete) return

        // Ejecutamos la llamada de eliminación en el hook usando el ID único de la amistad (_id)
        await removeFriend(friendshipToDelete._id)
        // Cerramos el modal de confirmación y limpiamos el estado auxiliar
        setIsDeleteOpen(false)
        setFriendshipToDelete(null)
    }

    // Resolviendo datos del amigo a eliminar para personalizar el mensaje de confirmación
    const friendDetailsForDelete = friendshipToDelete ? getFriendDetails(friendshipToDelete) : null
    const friendNameForDelete = friendDetailsForDelete
        ? (friendDetailsForDelete.user_name || friendDetailsForDelete.name || friendDetailsForDelete.email)
        : ''

    return (
        <>
            {/* Modal Principal de la Aplicación */}
            <Modal isOpen={isOpen} onClose={onClose} title="Amigos y Solicitudes">
                <div className="friends-container">

                    {/* 6. Barra de Pestañas (Tabs) */}
                    <div className="friends-tabs">
                        <button
                            className={`friends-tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('friends'); clearMessages(); }}
                        >
                            <FaUsers /> Amigos
                        </button>

                        <button
                            className={`friends-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('pending'); clearMessages(); }}
                        >
                            <FaUserClock /> Solicitudes
                            {/* Mostramos el globo rojo de notificaciones sólo si hay solicitudes pendientes */}
                            {pendingRequest.length > 0 && (
                                <span className="pending-badge">{pendingRequest.length}</span>
                            )}
                        </button>

                        <button
                            className={`friends-tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('add'); clearMessages(); }}
                        >
                            <FaUserPlus /> Agregar Amigo
                        </button>
                    </div>

                    {/* 7. Mensajes de Éxito o Error de los servicios */}
                    {succes && <div className="alert alert--success">{succes}</div>}
                    {error && <div className="alert alert--error">{error.message}</div>}

                    {/* 8. Contenido Dinámico de las Pestañas */}
                    <div className="friends-content">

                        {/* Spinner de Carga */}
                        {loading && (
                            <div className="friends-loader">
                                <div className="spinner">Cargando...</div>
                            </div>
                        )}

                        {/* PESTAÑA 1: Lista de Amigos Aceptados */}
                        {!loading && activeTab === 'friends' && (
                            <>
                                {friends.length === 0 ? (
                                    <div className="friends-empty-state">
                                        <FaInfoCircle className="friends-empty-icon" />
                                        <p>Aún no tienes amigos agregados.</p>
                                        <p>¡Ve a la pestaña de agregar amigo para expandir tu red!</p>
                                    </div>
                                ) : (
                                    <div className="friends-list">
                                        {friends.map((friendship) => {
                                            const friendInfo = getFriendDetails(friendship)
                                            if (!friendInfo) return null

                                            const displayName = friendInfo.user_name || friendInfo.name || 'Usuario'
                                            return (
                                                <div className="friends-card" key={friendship._id}>
                                                    <div className="friends-card__info">
                                                        <div className="friends-avatar">
                                                            {getInitials(displayName)}
                                                        </div>
                                                        <div className="friends-details">
                                                            <span className="friends-name">{displayName}</span>
                                                            <span className="friends-email">{friendInfo.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="friends-actions">
                                                        {/* Al hacer clic, abrimos el modal de confirmación en lugar de window.confirm */}
                                                        <button
                                                            className="friends-btn friends-btn--delete"
                                                            onClick={() => handleOpenDelete(friendship)}
                                                            title="Eliminar amigo"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                        {/* PESTAÑA 2: Solicitudes Pendientes Recibidas */}
                        {!loading && activeTab === 'pending' && (
                            <>
                                {pendingRequest.length === 0 ? (
                                    <div className="friends-empty-state">
                                        <FaInfoCircle className="friends-empty-icon" />
                                        <p>No tienes solicitudes de amistad pendientes.</p>
                                    </div>
                                ) : (
                                    <div className="friends-list">
                                        {pendingRequest.map((request) => {
                                            // En las solicitudes de getPendingRequests del backend, el emisor siempre es 'requester'
                                            const senderInfo = request.requester
                                            if (!senderInfo) return null

                                            const displayName = senderInfo.user_name || senderInfo.name || 'Usuario'
                                            return (
                                                <div className="friends-card" key={request._id}>
                                                    <div className="friends-card__info">
                                                        {/* Avatar amarillo de color pendiente */}
                                                        <div className="friends-avatar pending">
                                                            {getInitials(displayName)}
                                                        </div>
                                                        <div className="friends-details">
                                                            <span className="friends-name">{displayName}</span>
                                                            <span className="friends-email">{senderInfo.email}</span>
                                                        </div>
                                                    </div>
                                                    {/* Acciones de Aceptar o Rechazar */}
                                                    <div className="friends-actions">
                                                        <button
                                                            className="friends-btn friends-btn--accept"
                                                            onClick={() => acceptRequest(request._id)}
                                                            title="Aceptar solicitud"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            className="friends-btn friends-btn--reject"
                                                            onClick={() => rejectRequest(request._id)}
                                                            title="Rechazar solicitud"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                        {/* PESTAÑA 3: Formulario para Agregar Amigo */}
                        {!loading && activeTab === 'add' && (
                            <form className="friends-add-form" onSubmit={handleSendRequest}>
                                <div className="friends-form-group">
                                    <label htmlFor="friend-email" className="friends-email">
                                        Ingresa el correo electrónico de tu amigo para enviarle una solicitud de amistad.
                                    </label>
                                    <div className="friends-input-wrapper">
                                        <FaEnvelope className="friends-input-icon" />
                                        <input
                                            type="email"
                                            id="friend-email"
                                            placeholder="ejemplo@correo.com"
                                            className="friends-input"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem', borderRadius: '12px' }}
                                    disabled={loading || !emailInput.trim()}
                                >
                                    {loading ? 'Enviando...' : 'Enviar solicitud de amistad'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </Modal>

            {/* 9. DeleteConfirmModal: Modal de confirmación premium de eliminaciones (reemplaza a window.confirm) */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false)
                    setFriendshipToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar amigo"
                message={
                    <span>
                        ¿Estás seguro de que deseas eliminar a <strong>{friendNameForDelete}</strong> de tu lista de amigos?
                    </span>
                }
                confirmText="Eliminar"
                loading={loading}
            />
        </>
    )
}

export default FriendsModal