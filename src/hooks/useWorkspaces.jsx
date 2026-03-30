import { useEffect } from "react"
import useRequest from "./useRequest"
import { getWorkspaces } from "../service/workspace.service"

function useWorkSpaces() {
    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    useEffect(
        () => {
            sendRequest(
                {
                    requestCb: getWorkspaces
                }
            )
        },
        []
    )

    return {
        response,
        loading,
        error,
        workspaces: response?.data?.workspacesList //Esto lo hacemos para saber si la respuesta de la consulta a la BD trae al menos un espacio de trabajo
    }
}

export default useWorkSpaces