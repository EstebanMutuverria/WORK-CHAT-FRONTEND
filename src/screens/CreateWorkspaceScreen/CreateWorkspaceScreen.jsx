import React from 'react'
import { createWorkspace } from '../../service/workspace.service.js'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { Navigate, Link } from 'react-router'
import '../../styles/auth.css'

const CreateWorkspaceScreen = () => {
    const CREATE_WORKSPACE_FIELD_NAMES = {
        TITLE: 'title',
        DESCRIPTION: 'description',
        URL_IMG: 'url_image'
    }

    const InitialFormState = {
        [CREATE_WORKSPACE_FIELD_NAMES.TITLE]: '',
        [CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION]: '',
        [CREATE_WORKSPACE_FIELD_NAMES.URL_IMG]: ''
    }

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    function onCreateWorkspace(formState) {
        sendRequest({
            requestCb: async () => {
                return await createWorkspace({
                    title: formState[CREATE_WORKSPACE_FIELD_NAMES.TITLE],
                    description: formState[CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION],
                    url_image: formState[CREATE_WORKSPACE_FIELD_NAMES.URL_IMG]
                })
            }
        })
    }

    const {
        handleChangeInput, //es la funcion que debo ASOCIAR al cambio del input (onChange)
        onSubmit,
        formState, //es el estado con los valores MAS ACTUALES de cada campo de mi formulario
        resetForm
    } = useForm({ initialFormState: InitialFormState, submitFn: onCreateWorkspace })

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-card__brand">
                    <div className="auth-card__logo">🏢</div>
                    <span className="auth-card__app-name">WorkChat</span>
                </div>

                <div>
                    <h1 className="auth-card__title">Crear espacio de trabajo</h1>
                    <p className="auth-card__subtitle">Configurá un nuevo lugar para que tu equipo pueda colaborar.</p>
                </div>

                {error && (
                    <div className="alert alert--error" role="alert">
                        {error.message || 'Error al crear el espacio. Por favor, intentá de nuevo.'}
                    </div>
                )}

                {
                    response && !response.ok && (
                        <div className="alert alert--error" role="alert">
                            {response.message || 'Error al crear el espacio. Por favor, intentá de nuevo.'}
                        </div>
                    )
                }

                {response && response.ok && !error ?
                    <div className="alert alert--success" role="alert">
                        Espacio de trabajo creado correctamente.
                    </div>
                    :
                    <form className="form" onSubmit={onSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label" htmlFor={CREATE_WORKSPACE_FIELD_NAMES.TITLE}>Titulo</label>
                            <input
                                className="form-input"
                                type="text"
                                id={CREATE_WORKSPACE_FIELD_NAMES.TITLE}
                                name={CREATE_WORKSPACE_FIELD_NAMES.TITLE}
                                placeholder="Ej: Equipo de Marketing"
                                onChange={handleChangeInput}
                                value={formState[CREATE_WORKSPACE_FIELD_NAMES.TITLE]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor={CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION}>Descripción</label>
                            <input
                                className="form-input"
                                type="text"
                                id={CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION}
                                name={CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION}
                                placeholder="¿De qué trata este espacio?"
                                onChange={handleChangeInput}
                                value={formState[CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor={CREATE_WORKSPACE_FIELD_NAMES.URL_IMG}> Seleccione la Imagen</label>
                            <input
                                className="form-input"
                                type="text"
                                id={CREATE_WORKSPACE_FIELD_NAMES.URL_IMG}
                                name={CREATE_WORKSPACE_FIELD_NAMES.URL_IMG}
                                onChange={handleChangeInput}
                                placeholder='Por ahora es texto...'
                                value={formState[CREATE_WORKSPACE_FIELD_NAMES.URL_IMG]}
                                required
                            />
                        </div>

                        <button
                            className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creando espacio...' : 'Crear espacio de trabajo'}
                        </button>

                        <Link to="/home" className="btn btn--secondary">
                            Cancelar
                        </Link>
                    </form>
                }


                {response && response.ok && !error && <Link className='btn btn--primary' to="/home">Volver al inicio</Link>}
            </div>
        </div>
    )
}

export default CreateWorkspaceScreen