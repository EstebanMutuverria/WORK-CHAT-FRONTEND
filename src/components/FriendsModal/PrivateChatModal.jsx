import React, { useEffect } from 'react';
import Modal from '../Modal/Modal';
import PrivateMessageList from '../Messages/PrivateMessageList';
import PrivateMessageInput from '../Messages/PrivateMessageInput';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import usePrivateMessages from '../../hooks/usePrivateMessages';
import { IoMdRefresh } from 'react-icons/io';
import './PrivateChatModal.css';
import '../../screens/Workspace/WorkspaceScreen.css';

const PrivateChatModal = ({ isOpen, onClose, friendInfo }) => {
    if (!isOpen || !friendInfo) return null;

    const friendId = friendInfo._id || friendInfo.id;
    const displayName = friendInfo.user_name || friendInfo.name || 'Usuario';
    const avatarUrl = friendInfo.url_image;

    // Consumimos el hook personalizado
    const {
        messages,
        loading,
        fetchMessages,
        sendMessage,
        sendLoading,
        handleRequestDelete,
        handleConfirmDelete,
        handleCloseDeleteModal,
        isDeleteModalOpen,
        deleteLoading
    } = usePrivateMessages(friendId);

    // Cargar los mensajes cuando se abre el modal o cambia el amigo
    useEffect(() => {
        if (isOpen && friendId) {
            fetchMessages();
        }
    }, [isOpen, friendId, fetchMessages]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .filter(Boolean)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                title={
                    <div className="private-chat-header-title">
                        <div className="private-chat-avatar-wrapper">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="private-chat-avatar-img" />
                            ) : (
                                <div className="private-chat-avatar-initials">
                                    {getInitials(displayName)}
                                </div>
                            )}
                        </div>
                        <div className="private-chat-header-text">
                            <span className="private-chat-name">{displayName}</span>
                            <span className="private-chat-status">Mensaje Privado</span>
                        </div>
                        <button
                            className="btn-refresh-chat"
                            onClick={fetchMessages}
                            disabled={loading}
                            title="Refrescar mensajes"
                        >
                            <IoMdRefresh className={loading ? 'spinning' : ''} />
                        </button>
                    </div>
                }
            >
                <div className="private-chat-body">
                    <div className="private-chat-messages-container">
                        <PrivateMessageList 
                            messages={messages} 
                            onDelete={handleRequestDelete} 
                            loading={loading} 
                        />
                    </div>
                    <div className="private-chat-input-container">
                        <PrivateMessageInput 
                            sendMessage={sendMessage} 
                            sendLoading={sendLoading} 
                        />
                    </div>
                </div>
            </Modal>

            {/* Modal secundario para confirmar la eliminación de un mensaje */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Eliminar mensaje privado"
                message="¿Estás seguro de que querés eliminar este mensaje? Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                loading={deleteLoading}
            />
        </>
    );
};

export default PrivateChatModal;
