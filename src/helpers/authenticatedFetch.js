/**
 * authenticatedFetch: Un pequeño wrapper sobre fetch que maneja el token y errores 401
 * Si la respuesta es 401 (Unauthorized), dispara un evento global para cerrar sesión.
 */
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext"

export const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
    
    const headers = {
        ...options.headers,
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        ...options,
        headers
    })

    if (response.status === 401) {
        // Disparar evento global de logout
        window.dispatchEvent(new CustomEvent('force-logout'))
    }

    return response
}
