import React, { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'
import './Messages.css'
import { IoChatbubblesOutline } from 'react-icons/io5'

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
            <div className="messages-loading-modern">
                <div className="messages-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>Cargando mensajes...</p>
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
                <p>¡Sé el primero en escribir en este canal!</p>
            </div>
        )
    }

    return (
        <div className="messages-list-modern">
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