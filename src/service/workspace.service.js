import ENVIRONMENT from "../config/environment.config.js";
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext";

export async function getWorkspaces() {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspaces',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            }
        }
    )
    const response = await response_http.json()
    return response
}

export async function createWorkspace({ title, description, image }) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (image) {
        formData.append('image', image)
    }

    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspaces',
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            },
            body: formData
        }
    )
    const response = await response_http.json()
    return response
}

export async function getWorkspaceById({ workspace_id }) {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            }
        }
    )
    const response = await response_http.json()
    return response
}