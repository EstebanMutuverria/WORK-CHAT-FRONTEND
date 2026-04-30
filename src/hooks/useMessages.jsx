import { useState, useCallback, useEffect } from 'react'
import useRequest from './useRequest'
import { getMessages, deleteMessage } from '../service/message.service'
import io from 'socket.io-client'
import ENVIRONMENT from '../config/environment.config'

/*
    useMessages centraliza toda la lógica del chat de un canal:
    - Obtener mensajes del servidor
    - Escuchar nuevos mensajes en tiempo real vía Socket.io
    - Iniciar el flujo de eliminación
    - Confirmar la eliminación y refrescar la lista

    USO:
    const {
        messages, loading, fetchMessages,
        handleRequestDelete,
        handleConfirmDelete, handleCloseDeleteModal,
        isDeleteModalOpen, deleteLoading
    } = useMessages({ workspace_id, channel_id })
*/

function useMessages({ workspace_id, channel_id }) {
    // Estado local de mensajes para poder actualizarlos en tiempo real
    const [messages, setMessages] = useState([])
    // ID del mensaje que el usuario quiere eliminar
    const [messageToDelete, setMessageToDelete] = useState(null)

    // Un hook de consulta para obtener mensajes
    const fetchRequest = useRequest()
    // Un hook de consulta separado para eliminar
    const deleteRequest = useRequest()

    // Pide los mensajes al servidor
    const fetchMessages = useCallback(() => {
        if (!workspace_id || !channel_id) return
        fetchRequest.sendRequest({
            requestCb: () => getMessages(workspace_id, channel_id)
        })
    }, [workspace_id, channel_id])

    // Actualiza el estado local cuando se reciben mensajes de la API
    useEffect(() => {
        if (fetchRequest.response?.data?.messages) {
            setMessages(fetchRequest.response.data.messages)
        }
    }, [fetchRequest.response])

    // Configuración de Socket.io para tiempo real
    useEffect(() => {
        if (!channel_id) return

        // Conectar al servidor de sockets
        const socket = io(ENVIRONMENT.API_URL)

        // Unirse a la sala del canal actual
        socket.emit('join_channel', channel_id)

        // Escuchar nuevos mensajes
        socket.on('new_message', (newMessage) => {
            setMessages((prevMessages) => {
                // Si el mensaje ya existe en el estado (por ejemplo, enviado por el mismo usuario), no duplicar
                if (prevMessages.some(msg => msg._id === newMessage._id)) return prevMessages
                return [...prevMessages, newMessage]
            })
        })

        // Limpieza de la conexión al desmontar o cambiar de canal
        return () => {
            socket.disconnect()
        }
    }, [channel_id])

    // Llamado cuando el usuario presiona "Eliminar" en un MessageItem.
    const handleRequestDelete = (message_id) => {
        setMessageToDelete(message_id)
    }

    // Llamado cuando el usuario confirma la eliminación.
    const handleConfirmDelete = async () => {
        if (!messageToDelete) return
        await deleteRequest.sendRequest({
            requestCb: () => deleteMessage(workspace_id, channel_id, messageToDelete)
        })
        setMessageToDelete(null)
        // Eliminamos el mensaje localmente para feedback instantáneo
        setMessages((prev) => prev.filter(m => m._id !== messageToDelete))
    }

    // Llamado cuando el usuario cancela o cierra el modal.
    const handleCloseDeleteModal = () => {
        setMessageToDelete(null)
    }

    return {
        messages, // Ahora retornamos el estado local sincronizado
        loading: fetchRequest.loading,
        error: fetchRequest.error,
        fetchMessages,
        handleRequestDelete,
        handleConfirmDelete,
        handleCloseDeleteModal,
        isDeleteModalOpen: !!messageToDelete,
        deleteLoading: deleteRequest.loading,
    }
}

export default useMessages
