import { useState, useCallback } from 'react'
import useRequest from './useRequest'
import { getMessages, deleteMessage } from '../service/message.service'

/*
    useMessages centraliza toda la lógica del chat de un canal:
    - Obtener mensajes del servidor
    - Iniciar el flujo de eliminación (abriendo el modal de confirmación)
    - Confirmar la eliminación y refrescar la lista

    Esto permite que WorkspaceScreen, MessageList y MessageItem
    sean componentes limpios sin lógica de negocio directa.

    USO:
    const {
        messages, loading, fetchMessages,
        handleRequestDelete,
        handleConfirmDelete, handleCloseDeleteModal,
        isDeleteModalOpen, deleteLoading
    } = useMessages({ workspace_id, channel_id })
*/

function useMessages({ workspace_id, channel_id }) {
    // ID del mensaje que el usuario quiere eliminar (null = modal cerrado)
    const [messageToDelete, setMessageToDelete] = useState(null)

    // Un hook de consulta para obtener mensajes
    const fetchRequest = useRequest()
    // Un hook de consulta separado para eliminar (así tienen estados independientes)
    const deleteRequest = useRequest()

    // Pide los mensajes al servidor
    const fetchMessages = useCallback(() => {
        if (!workspace_id || !channel_id) return
        fetchRequest.sendRequest({
            requestCb: () => getMessages(workspace_id, channel_id)
        })
    }, [workspace_id, channel_id])

    // Llamado cuando el usuario presiona "Eliminar" en un MessageItem.
    // Solo guarda el ID y abre el modal. No elimina nada todavía.
    const handleRequestDelete = (message_id) => {
        setMessageToDelete(message_id)
    }

    // Llamado cuando el usuario confirma en el DeleteConfirmModal.
    // Ejecuta la eliminación real y luego refresca la lista.
    const handleConfirmDelete = async () => {
        if (!messageToDelete) return
        await deleteRequest.sendRequest({
            requestCb: () => deleteMessage(workspace_id, channel_id, messageToDelete)
        })
        setMessageToDelete(null)
        fetchMessages()
    }

    // Llamado cuando el usuario cancela o cierra el DeleteConfirmModal.
    const handleCloseDeleteModal = () => {
        setMessageToDelete(null)
    }

    return {
        messages: fetchRequest.response?.data?.messages || [],
        loading: fetchRequest.loading,
        error: fetchRequest.error,
        fetchMessages,
        // Todo lo relacionado al modal de eliminación
        handleRequestDelete,
        handleConfirmDelete,
        handleCloseDeleteModal,
        isDeleteModalOpen: !!messageToDelete,
        deleteLoading: deleteRequest.loading,
    }
}

export default useMessages
