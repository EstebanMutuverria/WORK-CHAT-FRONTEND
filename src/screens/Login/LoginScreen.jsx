import React, { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { login } from '../../service/auth.service'
import useForm from '../../hooks/useForm'
import { AuthContext } from '../../context/AuthContext'
import '../../styles/auth.css'

const LoginScreen = () => {

  const LOGIN_FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
  }
  const initialFormState = {
    [LOGIN_FORM_FIELDS.EMAIL]: '',
    [LOGIN_FORM_FIELDS.PASSWORD]: ''
  }

  const { manageLogin } = useContext(AuthContext)

  const {
    sendRequest, //Funcion para activar una consulta al servidor
    response, //Estado que guarda el estado de respuesta del servidor
    error, //Estado que guarda el estado de error del servidor
    loading //Estado que guarda el estado de cargando del servidor
  } = useRequest()

  /**
   * Esta funcion es la que se encarga de ejecutar la consulta al servidor
   * @param {Object} formState - Estado del formulario
   */
  function onLogin(formState) {
    sendRequest({
      requestCb: async () => {
        return await login({
          email: formState[LOGIN_FORM_FIELDS.EMAIL],
          password: formState[LOGIN_FORM_FIELDS.PASSWORD]
        })
      }
    })
  }


  const {
    handleChangeInput, //es la funcion que debo ASOCIAR al cambio del input (onChange)
    onSubmit,
    formState, //es el estado con los valores MAS ACTUALES de cada campo de mi formulario
    resetForm
  } = useForm({
    initialFormState,
    submitFn: onLogin
  })

  /*
  La funcion se carga cada vez que haya una (response) respuesta del servidor
  */
  useEffect(
    () => {
      //Si la respuesta es correcta guardo el token el contexto (Auth token) el cual se encarga de guardar el token en el 
      //localStorage
      if (response && response.ok) {
        manageLogin(response.data.auth_token)
      }
    },
    [response]
  )

  console.log(error)

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-card__brand">
          <div className="auth-card__logo">💬</div>
          <span className="auth-card__app-name">WorkChat</span>
        </div>

        <div>
          <h1 className="auth-card__title">Bienvenido de nuevo</h1>
          <p className="auth-card__subtitle">Inicia sesión en tu cuenta para continuar</p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error.message || 'Credenciales incorrectas. Intentá de nuevo.'}
          </div>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor={LOGIN_FORM_FIELDS.EMAIL}>Email</label>
            <input
              className="form-input"
              type="email"
              id={LOGIN_FORM_FIELDS.EMAIL}
              name={LOGIN_FORM_FIELDS.EMAIL}
              placeholder="tu@email.com"
              onChange={handleChangeInput}
              value={formState[LOGIN_FORM_FIELDS.EMAIL]}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={LOGIN_FORM_FIELDS.PASSWORD}>Contraseña</label>
            <input
              className="form-input"
              type="password"
              id={LOGIN_FORM_FIELDS.PASSWORD}
              name={LOGIN_FORM_FIELDS.PASSWORD}
              placeholder="••••••••"
              onChange={handleChangeInput}
              value={formState[LOGIN_FORM_FIELDS.PASSWORD]}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="form-links">
          <p className="form-link-text">
            ¿No tenés una cuenta? <Link to="/register">Registrate</Link>
          </p>
          <p className="form-link-text">
            ¿Olvidaste tu contraseña? <Link to="/reset-password-request">Restablecerla</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
