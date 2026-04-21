import ENVIRONMENT from "../config/environment.config.js";
import { authenticatedFetch } from "../helpers/authenticatedFetch";

export async function getWorkspaces() {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces',
        {
            method: 'GET'
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function createWorkspace({ title, description, image }) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (image) {
        formData.append('image', image)
    }

    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces',
        {
            method: 'POST',
            body: formData
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function getWorkspaceById({ workspace_id }) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id,
        {
            method: 'GET'
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

//Utilizar form data para la imagen
export async function updateWorkspace({ workspace_id, title, description, image }) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (image) {
        formData.append('image', image)
    }
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id,
        {
            method: 'PUT',
            body: formData
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}

export async function deleteWorkspace({ workspace_id }) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + '/api/workspaces/' + workspace_id,
        {
            method: 'DELETE'
        }
    )
    const response = await response_http.json()
    if (!response.ok) throw response
    return response
}