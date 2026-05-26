/**
 * @fileoverview Proveedor de contexto global de Autenticación.
 */

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * @type {React.Context}
 * @description Contexto para la autenticación de usuarios.
 */
export const AuthContext = createContext(
    {
        isLoggoed: false,
        user: null,
        showIntro: false,
        setIsLogged: () => { },
        setShowIntro: () => { },
        saveToken: () => { },
        logout: () => { }
    }
)

/**
 * Clave utilizada para guardar el token en localStorage.
 * @type {string}
 */
export const LOCALSTORAGE_TOKEN_KEY = 'slack_auth_token'

/**
 * Función auxiliar para decodificar un token JWT usando JS Nativo.
 * @param {string} token - Token JWT a decodificar.
 * @returns {Object|null} Payload decodificado o null en caso de error.
 */
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1] //Obtiene la segunda parte del token (payload)
        if (!base64Url) return null

        // Reemplazar caracteres de base64url a base64 estándar
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

        // Agregar relleno (padding) si es necesario
        const pad = base64.length % 4
        if (pad) {
            if (pad === 1) return null
            base64 += new Array(5 - pad).join('=')
        }

        const decodePayload = atob(base64) //Decodifica el payload
        
        // Decodificar correctamente como UTF-8 para soportar tildes, ñ y caracteres especiales
        const jsonPayload = decodeURIComponent(
            decodePayload.split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join('')
        )

        return JSON.parse(jsonPayload) //Convierte el payload decodificado en un objeto
    } catch (error) {
        return null
    }
}
/**
 * AuthContextProvider: Maneja el estado de sesión del usuario en un contexto global.
 * Es global para conocer si el usuario está logueado desde todas las pantallas.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos envueltos.
 * @returns {JSX.Element} Proveedor del contexto de autenticación.
 */
function AuthContextProvider({ children }) {

    function getInitialUser() {
        const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
        if (!token) {
            return null
        }
        return decodeToken(token)
    }
    const [isLogged, setIsLogged] = useState(Boolean(localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)))
    const [user, setUser] = useState(getInitialUser())
    const [showIntro, setShowIntro] = useState(false)

    //useNavigate es un hook de navegacion que me permite navegar entre pantallas
    const navigate = useNavigate()

    function manageLogin(auth_token) {
        //Guarda el auth_token en el localStorage
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, auth_token)
        setIsLogged(true)

        //Cada vez que se inicia sesion, decodificamos el token en el acto para setear el usuario con su data
        const decodeUser = decodeToken(auth_token)
        setUser(decodeUser)

        //Set showIntro to true to trigger the animation
        setShowIntro(true)

        //Navega a la pantalla home
        navigate('/home')
    }

    function logout() {
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY)
        setIsLogged(false)
        setUser(null)
        navigate('/login')
    }

    useEffect(() => {
        const handleForceLogout = () => {
            logout()
        }
        window.addEventListener('force-logout', handleForceLogout)
        return () => window.removeEventListener('force-logout', handleForceLogout)
    }, [logout])

    function updateUserContext(new_data) {
        setUser({ ...user, ...new_data })
    }

    function updateToken(auth_token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, auth_token)
        const decodeUser = decodeToken(auth_token)
        setUser(decodeUser)
    }


    const providerValues = {
        isLogged,
        user,
        showIntro,
        setIsLogged,
        setShowIntro,
        manageLogin,
        logout,
        updateUserContext,
        updateToken
    }
    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider