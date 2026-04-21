import { useEffect, useCallback } from "react"
import useRequest from "./useRequest"
import { getWorkspaces } from "../service/workspace.service"

function useWorkSpaces() {
    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const fetchWorkspaces = useCallback(() => {
        sendRequest({ requestCb: getWorkspaces })
    }, [sendRequest])

    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    return {
        response,
        loading,
        error,
        workspaces: response?.data?.workspacesList,
        refetch: fetchWorkspaces
    }
}

export default useWorkSpaces