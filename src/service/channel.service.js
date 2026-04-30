import ENVIRONMENT from "../config/environment.config.js"
import { authenticatedFetch } from "../helpers/authenticatedFetch"

export async function getChannelsByWorkspaceId({ workspace_id }) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id + '/channels',
        {
            method: 'GET'
        }
    )

    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function createChannel({ workspace_id, title, description }) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id + '/channels',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function updateChannel({ workspace_id, channel_id, title, description }) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/channels/${channel_id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function deleteChannel(workspace_id, channel_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/channels/${channel_id}`,
        {
            method: 'DELETE'
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}