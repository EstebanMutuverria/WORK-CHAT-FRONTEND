import { createContext, useState } from "react";
import { useNavigate } from "react-router";

export const AuthContext = createContext(
    {
        isLoggoed: false,
        setIsLogged: () => { },
        saveToken: () => { }
    }
)

export const LOCALSTORAGE_TOKEN_KEY = 'slack_auth_token'

/*
AuthContext: Va a manejar el estado de sesión del usuario en un contexto global

Es global ya que quiero saber desde todas las pantallas de la web si el usuario esta o no logueado

ABSOLUTAMENTE TODOS LOS COMPONENTES DE LA APP VAN A TENER ACCESO A ESTE CONTEXTO
*/

function AuthContextProvider({ children }) {
    const [isLogged, setIsLogged] = useState(Boolean(localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)))

    //useNavigate es un hook de navegacion que me permite navegar entre pantallas
    const navigate = useNavigate()

    function manageLogin(auth_token) {
        //Guarda el auth_token en el localStorage
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, auth_token)
        setIsLogged(true)
        //Navega a la pantalla home
        navigate('/home')
    }

    const providerValues = {
        isLogged,
        setIsLogged,
        manageLogin
    }
    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider