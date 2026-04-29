import ENVIRONMENT from "../config/environment.config.js";
import { authenticatedFetch } from "../helpers/authenticatedFetch.js";

export async function updateUser(name, user_id) {
    const response_http = await authenticatedFetch(
        ENVIRONMENT.API_URL + `/api/user/${user_id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name
            })
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