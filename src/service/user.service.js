import ENVIRONMENT from "../config/environment.config.js";
import { authenticatedFetch } from "../helpers/authenticatedFetch.js";

export async function updateUser(updateData, user_id) {
    const formData = new FormData()
    formData.append('name', updateData.name || '')
    formData.append('github', updateData.github || '')
    formData.append('linkedin', updateData.linkedin || '')
    formData.append('twitter', updateData.twitter || '')
    formData.append('instagram', updateData.instagram || '')
    if (updateData.url_image) {
        formData.append('url_image', updateData.url_image)
    }

    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/user/${user_id}`,
        {
            method: 'PUT',
            body: formData
        }
    )
    const response = await response_http.json()
    return response
}

export async function deleteUser(user_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/user/${user_id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const response = await response_http.json()
    return response
}