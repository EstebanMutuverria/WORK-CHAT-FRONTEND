import ENVIRONMENT from "../config/environment.config";
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext";
import { authenticatedFetch } from "../helpers/authenticatedFetch";

export async function createMessage(workspace_id, channel_id, content, file = null) {
    let body;
    let headers = {};

    if (file) {
        body = new FormData();
        body.append('content', content);
        body.append('file', file);
        // Cuando usamos FormData, el navegador establece automáticamente el Content-Type correcto con el boundary
    } else {
        body = JSON.stringify({ content });
        headers['Content-Type'] = 'application/json';
    }

    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/channels/${channel_id}/message`,
        {
            method: 'POST',
            headers: headers,
            body: body
        }
    )

    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}

export async function getMessages(workspace_id, channel_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/channels/${channel_id}/message`,
        {
            method: 'GET',
        }
    )

    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}

export async function deleteMessage(workspace_id, channel_id, message_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/channels/${channel_id}/message/${message_id}`,
        {
            method: 'DELETE',
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}