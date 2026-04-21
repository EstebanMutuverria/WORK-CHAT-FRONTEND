import ENVIRONMENT from "../config/environment.config.js"
import { authenticatedFetch } from "../helpers/authenticatedFetch"


export async function createMember(workspace_id, email, role) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/members/invite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                role: role
            })
        }
    )

    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function updateMemberRole(workspace_id, member_id, role) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/members/${member_id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role })
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function deleteMember(workspace_id, member_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/members/${member_id}`,
        {
            method: 'DELETE'
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}
