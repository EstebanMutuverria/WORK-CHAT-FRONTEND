import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router'

/*
AuthMiddleware: Es un componente a nivel de ruta que se encarga de validar si el usuario esta logueado

Si el usuario esta logueado, se renderiza el componente que se le pasa como children

Si el usuario no esta logueado, se redirige al usuario a la pantalla de login
*/

const AuthMiddleware = () => {
    const { isLogged } = useContext(AuthContext)
    return (
        <>
            {
                isLogged ? <Outlet /> : <Navigate to="/login" />
            }
        </>
    )
}

export default AuthMiddleware