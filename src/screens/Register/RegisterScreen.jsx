import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import useRequest from '../../hooks/useRequest.jsx'
import useForm from '../../hooks/useForm.jsx'
import { register } from '../../service/auth.service.js'
import '../../styles/auth.css'
import { FaEye } from "react-icons/fa";
import { showPassword } from '../../helpers/showPassword.helper.js'

const RegisterScreen = () => {
  const REGISTER_FORM_FIELDS = {
    name: 'name',
    email: 'email',
    password: 'password'
  }
  const initialFormState = {
    [REGISTER_FORM_FIELDS.name]: '',
    [REGISTER_FORM_FIELDS.email]: '',
    [REGISTER_FORM_FIELDS.password]: ''
  }

  function onRegister(formState) {
    sendRequest(
      {
        requestCb: async () => {
          return await register({
            user_name: formState[REGISTER_FORM_FIELDS.name],
            email: formState[REGISTER_FORM_FIELDS.email],
            password: formState[REGISTER_FORM_FIELDS.password]
          })
        }
      }
    )

  }

  const {
    sendRequest, //Funcion para activar una consulta al servidor
    response, //Estado que guarda el estado de respuesta del servidor
    error, //Estado que guarda el estado de error del servidor
    loading //Estado que guarda el estado de cargando del servidor
  } = useRequest()

  const {
    handleChangeInput, //es la funcion que debo ASOCIAR al cambio del input (onChange)
    onSubmit,
    formState, //es el estado con los valores MAS ACTUALES de cada campo de mi formulario
    resetForm
  } = useForm({ initialFormState, submitFn: onRegister })

  const navigate = useNavigate()

  useEffect(
    () => {
      setTimeout(() => {
        if (response && response.ok) {
          navigate('/login')
        }
        console.log(response)
      }, 6000);
    },
    [response]
  )

  // showPassword(REGISTER_FORM_FIELDS.password) // REMOVED: This causes error because the DOM is not ready yet during render

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-card__brand">
          <div className="auth-card__logo">💬</div>
          <span className="auth-card__app-name">WorkChat</span>
        </div>

        <div>
          <h1 className="auth-card__title">Crear una cuenta</h1>
          <p className="auth-card__subtitle">Unite a tu equipo en WorkChat</p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error.message || 'Ocurrió un error. Intentá de nuevo.'}
          </div>
        )}

        {response && response.ok ? (
          <div className="alert alert--success" role="status">
            ¡Cuenta creada! Revisá tu email para verificarla.
          </div>
        ) : (
          < form className="form" onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor={REGISTER_FORM_FIELDS.name}>Nombre</label>
              <input
                className="form-input"
                type="text"
                id={REGISTER_FORM_FIELDS.name}
                name={REGISTER_FORM_FIELDS.name}
                placeholder="Tu nombre"
                onChange={handleChangeInput}
                value={formState[REGISTER_FORM_FIELDS.name]}
                autoComplete="name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={REGISTER_FORM_FIELDS.email}>Email</label>
              <input
                className="form-input"
                type="email"
                id={REGISTER_FORM_FIELDS.email}
                name={REGISTER_FORM_FIELDS.email}
                placeholder="tu@email.com"
                onChange={handleChangeInput}
                value={formState[REGISTER_FORM_FIELDS.email]}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={REGISTER_FORM_FIELDS.password}>Contraseña</label>
              <div className='form-input-eyebtn-container'>
                <input
                  className="form-input"
                  type="password"
                  id={REGISTER_FORM_FIELDS.password}
                  name={REGISTER_FORM_FIELDS.password}
                  placeholder="••••••••"
                  onChange={handleChangeInput}
                  value={formState[REGISTER_FORM_FIELDS.password]}
                  autoComplete="new-password"
                  required
                />
                <button type='button' onClick={() => showPassword(REGISTER_FORM_FIELDS.password)}>
                  <FaEye />
                </button>
              </div>
            </div>
            <button
              className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
        )}

        <div className="form-links">
          <p className="form-link-text">
            ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div >
  )
}


export default RegisterScreen
