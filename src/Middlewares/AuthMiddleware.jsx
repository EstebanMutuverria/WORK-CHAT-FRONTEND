import React, { useContext, useEffect } from 'react'
import { AuthContext, LOCALSTORAGE_TOKEN_KEY } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router'
import { verifyToken } from '../service/auth.service'

/**
 * Middleware de Autenticación.
 * Componente que intercepta las rutas protegidas y verifica la validez del token
 * del usuario contra el backend de manera asíncrona. Si el usuario no está logueado
 * es redirigido a '/login'.
 * 
 * @returns {JSX.Element} Componente de ruta Outlet si está autenticado, caso contrario Navigate a '/login'.
 */
const AuthMiddleware = () => {
    const { isLogged, logout } = useContext(AuthContext)

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            if (token) {
                try {
                    const response = await verifyToken(token)
                    if (response.status === 401) {
                        console.error("Usuario no encontrado o sesión inválida")
                        logout()
                    }
                } catch (error) {
                    console.error("Error al validar la sesión:", error)
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