import ENVIRONMENT from "../config/environment.config.js"

export async function login({ email, password }) {
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/login`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email,
                    password
                }
            )
        }
    )

    const response = await response_http.json()
    return response
}

export async function register({ user_name, email, password }) {
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    user_name,
                    email,
                    password
                }
            )
        }
    )
    return await response_http.json()
}

export async function resetPasswordRequest({ email }) {
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/reset-password-request`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email
                }
            )
        }
    )
    return await response_http.json()
}