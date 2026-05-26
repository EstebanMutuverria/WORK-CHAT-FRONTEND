import { useState, useCallback, useEffect } from 'react'
import useRequest from './useRequest'
import { getMessages, deleteMessage } from '../service/message.service'

/**
 * Hook useMessages:
 * Centraliza toda la lógica de obtención y eliminación de mensajes de un canal,
 * siguiendo el patrón estandarizado de hooks del proyecto.
 */
export default function useMessages({ workspace_id, channel_id }) {
    //1-Estados locales
    const [messages, setMessages] = useState([]) // Estado local de mensajes para poder actualizarlos en tiempo real
    const [messageToDelete, setMessageToDelete] = useState(null) // ID del mensaje que el usuario quiere eliminar

    //Instanciamos el useRequest
    const fetchRequest = useRequest() // Un hook de consulta para obtener mensajes
    const deleteRequest = useRequest() // Un hook de consulta separado para eliminar

    //2- Funcion: Obtener Mensajes
    const fetchMessages = useCallback(
        async () => {
            if (!workspace_id || !channel_id) return
            await fetchRequest.sendRequest(
                {
                    requestCb: async () => {
                        const res = await getMessages(workspace_id, channel_id)
                        return res
                    }
                }
            )
        }, [workspace_id, channel_id, fetchRequest]
    )

    // Efecto para sincronizar el estado local cuando se reciben mensajes de la API
    useEffect(() => {
        if (fetchRequest.response?.data?.messages) {
            setMessages(fetchRequest.response.data.messages)
        }
    }, [fetchRequest.response])

    //3- Función: Iniciar eliminación de mensaje
    const handleRequestDelete = useCallback((message_id) => {
        setMessageToDelete(message_id)
    }, [])

    //4- Función: Confirmar eliminación de mensaje
    const handleConfirmDelete = useCallback(
        async () => {
            if (!messageToDelete) return
            await deleteRequest.sendRequest(
                {
                    requestCb: async () => {
                        const res = await deleteMessage(workspace_id, channel_id, messageToDelete)
                        return res
                    }
                }
            )
            setMessageToDelete(null)
            // Eliminamos el mensaje localmente para feedback instantáneo
            setMessages((prev) => prev.filter(m => m._id !== messageToDelete))
        }, [workspace_id, channel_id, messageToDelete, deleteRequest]
    )

    //5- Función: Cancelar o cerrar modal de eliminación
    const handleCloseDeleteModal = useCallback(() => {
        setMessageToDelete(null)
    }, [])

    //6- Retornamos todo lo necesario para la UI (el componente que se encargara de renderizar los datos a el usuario)
    return {
        messages,
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
