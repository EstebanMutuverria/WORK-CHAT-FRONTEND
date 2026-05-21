import { useCallback, useState } from "react"
import useRequest from "./useRequest"
import { deleteFriendship, getFriends, getPendingRequests, sendFriendshipRequest, updateRequestStatus } from "../service/friendship.service.js"
import FRIENDSHIP_REQUEST_STATUS from "../constants/friendshipRequestStatus.js"

export default function useFriends() {
    //1-Estados locales
    const [friends, setFriends] = useState([])
    const [pendingRequest, setPendingRequests] = useState([])
    const [succes, setSucces] = useState(null)


    //Instanciamos el useRequest
    const {
        sendRequest,
        loading,
        error,
        resetRequest,
        response
    } = useRequest()

    //2- Funcion: Obtener Amigos Aceptados
    //Se utiliza useCallback para evitar renderizados infinitas producto del useEffect de los componentes
    //fixea lo que escribi mal, hay problemas con los parentecis y las {}
    const fetchFriends = useCallback(
        async () => {
            await sendRequest(
                {
                    requestCb: async () => {
                        const res = await getFriends() //Guarda la lista de amigos aceptados
                        if (res.ok) {
                            setFriends(res.data)
                        }
                        return res
                    }
                }
            )
        }, [sendRequest]
    )

    //3- Funcion: Enviar Solicitud
    const fetchPendingRequests = useCallback(
        async () => {
            await sendRequest(
                {
                    requestCb: async () => {
                        const res = await getPendingRequests()
                        if (res.ok) {
                            setPendingRequests(res.data)
                        }
                    }
                }
            )
        }, [sendRequest]
    )

    //4- Función: Enviar solicitud de amistad
    const sendFriendship = async (email) => {
        setSucces(null) //Limpiamos mensajes anteriores
        let isSucces = false
        await sendRequest(
            {
                requestCb: async () => {
                    const res = await sendFriendshipRequest(email)
                    if (res.ok) {
                        setSucces('¡Solicitud de amistad enviada con éxito!')
                        isSucces = true
                    }
                    return res
                }
            }
        )
        return isSucces //Retorna true si todo salio bien, util para limpiar el input del formulario
    }

    //5- Función: Aceptar solicitud recibida
    const acceptRequest = async (id) => {
        setSucces(null)
        await sendRequest(
            {
                requestCb: async () => {
                    const res = await updateRequestStatus(id, FRIENDSHIP_REQUEST_STATUS.ACCEPTED)
                    if (res.ok) {
                        //Si se acepta con exito, refrescamos en paralelo ambas listas
                        const [friendsRes, pendingRes] = await Promise.all(
                            [
                                getFriends(),
                                getPendingRequests()
                            ]
                        )
                        if (friendsRes.ok) {
                            setFriends(friendsRes.data)
                        }
                        if (pendingRes.ok) {
                            setPendingRequests(pendingRes.data)
                        }
                        setSucces('¡Solicitud de amistad aceptada!')
                    }
                    return res
                }
            }
        )
    }

    //6- Función: Rechazar solicitud de amistad recibida
    const rejectRequest = async (id) => {
        setSucces(null)
        await sendRequest({
            requestCb: async () => {
                const res = await updateRequestStatus(id, FRIENDSHIP_REQUEST_STATUS.REJECTED)
                if (res.ok) {
                    //si se rechazo correctmente la solicitud refrescamos solo la lista de pendientes
                    const pendingRes = await getPendingRequests()
                    if (pendingRes.ok) {
                        setPendingRequests(pendingRes.data)
                    }
                    setSucces('¡Solicitud rechazada!')
                }
                return res
            }
        })
    }

    //7- Función: Eliminar amigo (o cancelar solicitud enviada)
    const removeFriend = async (id) => {
        setSucces(null)
        await sendRequest({
            requestCb: async () => {
                const res = await deleteFriendship(id)
                if (res.ok) {
                    //Si elimina correctamente, refrescamos la lista de amigos
                    const friendsRes = await getFriends()
                    if (friendsRes.ok) {
                        setFriends(friendsRes.data)
                    }
                    setSucces('¡Amigo eliminado correctamente!')
                }
                return res
            }
        })
    }

    //8- Función: Limpiar mensajes de error y exito
    const clearMessages = useCallback(() => {
        setSucces(null)
        resetRequest() //Resetea los estados de error y response de el hook useRequest
    }, [resetRequest])

    //9- Retornamos todo lo necesario para la UI (el componente que se encargara de renderizar los datos a el usuario)
    return {
        friends,
        pendingRequest,
        loading,
        error,
        response,
        succes,
        fetchFriends,
        fetchPendingRequests,
        sendFriendship,
        acceptRequest,
        rejectRequest,
        removeFriend,
        clearMessages
    }
}