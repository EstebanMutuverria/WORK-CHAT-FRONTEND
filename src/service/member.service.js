import ENVIRONMENT from "../config/environment.config.js"
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext.jsx"


export async function createMember(workspace_id, email, role) {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + `/api/workspaces/${workspace_id}/members/invite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            },
            body: JSON.stringify({
                email: email,
                role: role
            })
        })

    const response = await response_http.json()
    return response
}
