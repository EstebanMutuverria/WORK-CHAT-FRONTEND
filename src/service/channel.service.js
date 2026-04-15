import ENVIRONMENT from "../config/environment.config.js"
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext"

export async function getChannelsByWorkspaceId({ workspace_id }) {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id + '/channels',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            }
        }
    )

    const response = response_http.json()
    console.log(response)
    return response
}

export async function createChannel({ workspace_id, title, description }) {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id + '/channels',
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title,
                    description
                }
            )
        }
    )
    const response = response_http.json()
    return response
}