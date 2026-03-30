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
    console.log(response)
    return response
}