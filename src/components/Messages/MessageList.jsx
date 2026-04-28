import React, { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'
import './Messages.css'

const MessageList = ({ messages = [], onDelete, loading }) => {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    if (loading) {
        return (
            <div className="loading-state">
                <span className="spinner"></span>
                <span>Cargando mensajes...</span>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="empty-state">
                <p className="empty-state__description">No hay mensajes aún en este canal. ¡Sé el primero en escribir!</p>
            </div>
        )
    }

    return (
        <div className="messages-list">
            {messages.map(message => (
                <MessageItem
                    key={message._id}
                    message={message}
                    onDelete={onDelete}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList