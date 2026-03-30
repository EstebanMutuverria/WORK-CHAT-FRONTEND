import React, { useEffect } from 'react';
import { resetPasswordRequest } from '../../service/auth.service.js';
import useRequest from '../../hooks/useRequest.jsx';
import useForm from '../../hooks/useForm.jsx';
import { Link, useNavigate } from 'react-router';
import '../../styles/auth.css';

const ResetPasswordRequestScreen = () => {
    const RESET_PASSWORD_REQUEST_FORM_NAME = {
        EMAIL: 'email'
    }

    const initialFormState = {
        [RESET_PASSWORD_REQUEST_FORM_NAME.EMAIL]: ''
    }

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    function submitResetPasswordRequest() {
        sendRequest(
            {
                requestCb: async () => {
                    return await resetPasswordRequest(
                        {
                            email: formState[RESET_PASSWORD_REQUEST_FORM_NAME.EMAIL]
                        }
                    )
                }
            }
        )
    }

    const {
        handleChangeInput, //es la funcion que debo ASOCIAR al cambio del input (onChange)
        onSubmit,
        formState, //es el estado con los valores MAS ACTUALES de cada campo de mi formulario
        resetForm
    } = useForm({
        initialFormState,
        submitFn: submitResetPasswordRequest
    })

    const navigate = useNavigate()

    useEffect(
        () => {
            setTimeout(() => {
                if (response && response.ok) {
                    navigate('/login')
                }
            }, 6000);
        },
        [response]
    )

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-card__brand">
                    <div className="auth-card__logo">🔑</div>
                    <span className="auth-card__app-name">WorkChat</span>
                </div>

                <div>
                    <h1 className="auth-card__title">Restablecer contraseña</h1>
                    <p className="auth-card__subtitle">
                        Te enviaremos un mail con instrucciones para restablecer tu contraseña.
                    </p>
                </div>

                {error && (
                    <div className="alert alert--error" role="alert">
                        {error.message || 'Ocurrió un error. Intentá de nuevo.'}
                    </div>
                )}

                {
                    response && !loading && !error
                        ? (
                            <div className="alert alert--success" role="status">
                                {response.message || '¡Listo! Revisá tu bandeja de entrada.'}
                            </div>
                        )
                        : (
                            <form className="form" onSubmit={onSubmit} noValidate>
                                <div className="form-group">
                                    <label className="form-label" htmlFor={RESET_PASSWORD_REQUEST_FORM_NAME.EMAIL}>
                                        Email
                                    </label>
                                    <input
                                        className="form-input"
                                        type="email"
                                        placeholder="tu@email.com"
                                        onChange={handleChangeInput}
                                        name={RESET_PASSWORD_REQUEST_FORM_NAME.EMAIL}
                                        id='email'
                                        value={formState[RESET_PASSWORD_REQUEST_FORM_NAME.EMAIL]}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                <button
                                    className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                                </button>
                            </form>
                        )
                }

                <div className="form-links">
                    <p className="form-link-text">
                        ¿Recordás la contraseña? <Link to="/login">Iniciá sesión</Link>
                    </p>
                    <p className="form-link-text">
                        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ResetPasswordRequestScreen;
