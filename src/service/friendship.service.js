import ENVIRONMENT from "../config/environment.config.js";
import { authenticatedFetch } from "../helpers/authenticatedFetch.js";

export async function sendFriendshipRequest(emailRecipient) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/friendship',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailRecipient: emailRecipient
            })
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}

export async function updateRequestStatus(id, status) {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/friendship/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: status
            })
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw response
    }
    return response
}

export async function deleteFriendship(id) {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/friendship/${id}`,
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

export async function getFriends() {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/friendship/friends`,
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

export async function getPendingRequests() {
    const response_http = await authenticatedFetch(
        `${ENVIRONMENT.API_URL}/api/friendship/pending`,
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