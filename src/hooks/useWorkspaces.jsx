import { useEffect, useCallback } from "react"
import useRequest from "./useRequest"
import { getWorkspaces } from "../service/workspace.service"

export default function useWorkSpaces() {
    //1-Estados locales
    // (No se requieren estados locales adicionales en este hook)

    //Instanciamos el useRequest
    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    //2- Funcion: Obtener Espacios de Trabajo
    const fetchWorkspaces = useCallback(
        async () => {
            await sendRequest(
                {
                    requestCb: async () => {
                        const res = await getWorkspaces()
                        return res
                    }
                }
            )
        }, [sendRequest]
    )

    //Efecto para la carga inicial
    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    //3- Retornamos todo lo necesario para la UI (el componente que se encargara de renderizar los datos a el usuario)
    return {
        response,
        loading,
        error,
        workspaces: response?.data?.workspacesList,
        refetch: fetchWorkspaces
    }
}