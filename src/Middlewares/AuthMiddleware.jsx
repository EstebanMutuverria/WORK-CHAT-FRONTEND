import React, { useContext, useEffect } from 'react'
import { AuthContext, LOCALSTORAGE_TOKEN_KEY } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router'
import { verifyToken } from '../service/auth.service'

const AuthMiddleware = () => {
    const { isLogged, logout } = useContext(AuthContext)

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            if (token) {
                const response = await verifyToken(token)
                if (response.status === 401) {
                    console.error("Usuario no encontrado o sesión inválida")
                    logout()
                }
            }
        }
        if (isLogged) {
            validateSession()
        }
    }, [isLogged, logout])

    return (
        <>
            {
                isLogged ? <Outlet /> : <Navigate to="/login" />
            }
        </>
    )
}

export default AuthMiddleware