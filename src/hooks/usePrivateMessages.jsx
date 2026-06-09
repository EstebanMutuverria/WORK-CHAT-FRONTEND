import { useCallback, useEffect, useState } from "react";
import useRequest from "./useRequest";
import { createPrivateMessage, deletePrivateMessage, getPrivateMessages } from "../service/privateMessages.service.js";

/** Custom hook para manejar los mensajes privados de un usuario.
 * Centraliza la lógica de carga, envvio y eliminacion de mensajes privados,
 * manteniendo sincronizado el estado local del chat
 * @param {string} friend_id - ID del amigo con el que se está conversando.
 */

export default function usePrivateMessages(friend_id) {
    //Estado para los mensajes de la conversacion
    const [messages, setMessages] = useState([])

    //Control de eliminacion
    const [messageToDelete, setMessageToDelete] = useState(null)

    //Spinner al enviar el mensaje
    const [sendLoading, setSendLoading] = useState(false)

    //Para obtener el historial de mensajes
    const fetchRequest = useRequest()
    const { sendRequest: fetchSendRequest } = fetchRequest

    //Para borrar el mensaje
    const deleteRequest = useRequest()
    const { sendRequest: deleteSendRequest } = deleteRequest

    //Funcion para trae mensajes del backend
    const fetchMessages = useCallback(
        async () => {
            if (!friend_id) {
                return
            }
            await fetchSendRequest(
                {
                    requestCb: async () => {
                        const res = await getPrivateMessages(friend_id)
                        return res
                    }
                }
            )
        }, [friend_id, fetchSendRequest]
    )

    //Sincronizar el estado local cuando llegan los mensajes de la API

    useEffect(
        () => {
            if (fetchRequest.response?.data?.messages) {
                setMessages(fetchRequest.response.data.messages)
            }
        }, [fetchRequest.response]
    )

    // Funcion para enviar un mensaje (texto + archivo adjunto opcional)
    const sendMessage = async (content, file = null) => {
        if (!friend_id) {
            return
        }
        setSendLoading(true)
        try {
            const res = await createPrivateMessage(friend_id, content, file)
            if (res.ok && res.data?.message) {
                // Sincronizamos la lista local agregando el mensaje creado
                setMessages(prev => [...prev, res.data.message])
            }
            return res
        } catch (error) {
            // Re-lanzamos el error por si el componente input quiere manejarlo
            throw error
        } finally {
            setSendLoading(false)
        }
    }


    //iniciar el proceso de borrado
    const handleRequestDelete = useCallback(
        (message_id) => {
            setMessageToDelete(message_id)
        }, []
    )

    const handleConfirmDelete = useCallback(
        async () => {
            if (!messageToDelete) return
            await deleteSendRequest(
                {
                    requestCb: async () => {
                        const res = await deletePrivateMessage(messageToDelete)
                        return res
                    }
                }
            )
            //Filtramos localmente para dar feedback inmediato al usuario
            setMessages((prev) => prev.filter((m) => m._id !== messageToDelete))
            setMessageToDelete(null)
        }, [messageToDelete, deleteSendRequest]
    )

    //cerrar el modal de confirmacion
    const handleCloseDeleteModal = useCallback(
        () => {
            setMessageToDelete(null)
        }, []
    )

    return {
        messages,
        loading: fetchRequest.loading,
        error: fetchRequest.error,
        fetchMessages,
        sendMessage,
        handleRequestDelete,
        handleConfirmDelete,
        handleCloseDeleteModal,
        isDeleteModalOpen: !!messageToDelete,
        deleteLoading: deleteRequest.loading
    }



}