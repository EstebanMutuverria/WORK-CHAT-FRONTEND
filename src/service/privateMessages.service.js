import ENVIRONMENT from "../config/environment.config.js"
import { authenticatedFetch } from "../helpers/authenticatedFetch.js"

export async function createPrivateMessage(friend_id, content, attachment = null) {
    let body
    let headers = {}

    if (attachment) {
        body = new FormData()
        body.append('content', content)
        body.append('file', attachment)
        // Cuendo usamos FormData, el navegador establece automaticamente el Content-Type correncto en el boundary
    } else {
        body = JSON.stringify({ content })
        headers['Content-Type'] = 'application/json'
    }

    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/private-messages/${friend_id}`,
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

export async function getPrivateMessages(friend_id) {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/private-messages/${friend_id}`,
        {
            method: 'GET'
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}

export async function deletePrivateMessage(message_id) {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/private-messages/${message_id}`,
        {
            method: 'DELETE'
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}