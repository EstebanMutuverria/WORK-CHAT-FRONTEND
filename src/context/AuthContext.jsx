import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

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

export const LOCALSTORAGE_TOKEN_KEY = 'slack_auth_token'

// Función auxiliar para decodificar un token JWT usando JS Nativo
function decodeToken(token) {
    try {
        const payload = token.split('.')[1] //Obtiene la segunda parte del token (payload)
        const decodePayload = atob(payload) //Decodifica el payload
        return JSON.parse(decodePayload) //Convierte el payload decodificado en un objeto
    } catch (error) {
        return null
    }
}
/*
AuthContext: Va a manejar el estado de sesión del usuario en un contexto global

Es global ya que quiero saber desde todas las pantallas de la web si el usuario esta o no logueado

ABSOLUTAMENTE TODOS LOS COMPONENTES DE LA APP VAN A TENER ACCESO A ESTE CONTEXTO
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


    const providerValues = {
        isLogged,
        user,
        showIntro,
        setIsLogged,
        setShowIntro,
        manageLogin,
        logout,
        updateUserContext
    }
    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider