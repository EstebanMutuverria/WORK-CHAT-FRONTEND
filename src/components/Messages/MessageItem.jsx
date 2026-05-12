import React, { useContext } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import './Messages.css';
import { AuthContext } from '../../context/AuthContext';
import ENVIRONMENT from '../../config/environment.config';

const MessageItem = ({ message, onDelete }) => {
    const { user } = useContext(AuthContext)
    const authorName = message.fk_id_member?.fk_id_user?.user_name || 'Usuario';
    const initials = authorName.substring(0, 2).toUpperCase();
    const authorId = message.fk_id_member?.fk_id_user?._id || message.fk_id_member?.fk_id_user;
    const isMessageMine = authorId?.toString() === user?.id;

    // Formatear la fecha
    const date = new Date(message.created_at);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="message-item">
            <div className="message-avatar">
                {initials}
            </div>
            <div className="message-body">
                <div className="message-header">
                    <span className="message-author">{authorName}</span>
                    <span className="message-time">{timeString}</span>
                </div>
                <div className="message-text">
                    {message.content}
                </div>
                {message.attachment && (
                    <div className="message-attachment">
                        <img src={message.attachment} alt="Attachment" className="message-image" />
                    </div>
                )}
            </div>

            <div className="message-actions">
                {
                    isMessageMine && (
                        <button
                            className="action-btn"
                            onClick={() => onDelete(message._id)}
                            title="Eliminar mensaje"
                        >
                            <HiOutlineTrash size={18} />
                        </button>
                    )
                }
            </div>
        </div>
    );
};

export default MessageItem;