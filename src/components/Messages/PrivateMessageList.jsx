import React, { useEffect, useRef } from 'react'
import PrivateMessageItem from './PrivateMessageItem'
import './Messages.css'
import { IoChatbubblesOutline } from 'react-icons/io5'

const PrivateMessageList = ({ messages = [], onDelete, loading }) => {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Hace auto-scroll cada vez que la lista de mensajes cambia (mensajes nuevos)
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    if (loading) {
        return (
            <div className="messages-loading-modern">
                <div className="messages-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>Cargando mensajes privados...</p>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="messages-empty-modern">
                <div className="messages-empty-icon">
                    <IoChatbubblesOutline />
                </div>
                <h3>No hay mensajes aún</h3>
                <p>¡Sé el primero en iniciar la conversación privada!</p>
            </div>
        )
    }

    return (
        <div className="messages-list-modern">
            {messages.map(message => (
                <PrivateMessageItem
                    key={message._id}
                    message={message}
                    onDelete={onDelete}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default PrivateMessageList
