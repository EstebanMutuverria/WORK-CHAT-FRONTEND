import React, { useContext } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import './Messages.css';
import { AuthContext } from '../../context/AuthContext';
import ENVIRONMENT from '../../config/environment.config';

const MessageItem = ({ message, onDelete }) => {
    const { user } = useContext(AuthContext)
    const author = message.fk_id_member?.fk_id_user;
    const authorName = author?.user_name || 'Usuario';
    const initials = authorName.substring(0, 2).toUpperCase();
    const authorId = author?._id || author;
    const isMessageMine = authorId?.toString() === user?.id;
    const avatarUrl = author?.url_image;

    // Generar un gradiente único y persistente para las iniciales del usuario
    const getAvatarGradient = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const gradients = [
            'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', // Indigo
            'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', // Pink/Fuchsia
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
            'linear-gradient(135deg, #10b981 0%, #047857 100%)', // Emerald
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
            'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', // Purple
        ];
        return gradients[Math.abs(hash) % gradients.length];
    };

    // Formatear la fecha de forma moderna
    const date = new Date(message.created_at);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`message-item-modern ${isMessageMine ? 'message-mine' : ''}`}>
            <div 
                className="message-avatar-modern"
                style={{ 
                    background: !avatarUrl ? getAvatarGradient(authorName) : 'transparent',
                    boxShadow: !avatarUrl ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
                }}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={authorName} className="message-avatar-img-modern" />
                ) : (
                    <span>{initials}</span>
                )}
            </div>
            
            <div className="message-body-modern">
                <div className="message-header-modern">
                    <span className="message-author-modern">{authorName}</span>
                    <span className="message-time-modern">{timeString}</span>
                    {isMessageMine && <span className="message-tag-me-modern">tú</span>}
                </div>
                
                <div className="message-content-wrapper-modern">
                    <div className="message-text-modern">
                        {message.content}
                    </div>
                    {message.attachment && (
                        <div className="message-attachment-modern">
                            <img src={message.attachment} alt="Attachment" className="message-image-modern" />
                        </div>
                    )}
                </div>
            </div>

            {isMessageMine && (
                <div className="message-actions-modern">
                    <button
                        className="action-btn-modern delete"
                        onClick={() => onDelete(message._id)}
                        title="Eliminar mensaje"
                    >
                        <HiOutlineTrash size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageItem;