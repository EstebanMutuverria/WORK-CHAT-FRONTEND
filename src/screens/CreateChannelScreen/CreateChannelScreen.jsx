import React from 'react';
import { Link, useParams } from 'react-router';
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { createChannel } from '../../service/channel.service';

const CreateChannelScreen = () => {

    const workspace_id = useParams().workspace_id

    const {
        sendRequest, //Funcion para activar una consulta al servidor
        response, //Estado que guarda el estado de respuesta del servidor
        error, //Estado que guarda el estado de error del servidor
        loading //Estado que guarda el estado de cargando del servidor
    } = useRequest()

    const FORM_CHANNEL_FIELD_NAMES = {
        TITLE: 'title',
        DESCRIPTION: 'description',
    }

    const initialFormState = {
        [FORM_CHANNEL_FIELD_NAMES.TITLE]: '',
        [FORM_CHANNEL_FIELD_NAMES.DESCRIPTION]: '',
    }

    function onSubmitChannel(formState) {
        sendRequest({
            requestCb: async () => {
                return await createChannel({
                    workspace_id: workspace_id,
                    title: formState[FORM_CHANNEL_FIELD_NAMES.TITLE],
                    description: formState[FORM_CHANNEL_FIELD_NAMES.DESCRIPTION],
                })
            }
        })
    }

    const {
        handleChangeInput, //es la funcion que debo ASOCIAR al cambio del input (onChange)
        onSubmit,
        formState, //es el estado con los valores MAS ACTUALES de cada campo de mi formulario
        resetForm
    } = useForm({ initialFormState: initialFormState, submitFn: onSubmitChannel })

    const channel_id = response?.data?.channel._id
    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-card__brand">
                    <div className="auth-card__logo">🏢</div>
                    <span className="auth-card__app-name">WorkChat</span>
                </div>

                <div>
                    <h1 className="auth-card__title">Crear Canal</h1>
                    <p className="auth-card__subtitle">Configurá un nuevo canal para que tu equipo pueda colaborar.</p>
                </div>

                {error && (
                    <div className="alert alert--error" role="alert">
                        {error.message || 'Error al crear el canal. Por favor, intentá de nuevo.'}
                    </div>
                )}

                {
                    response && !response.ok && (
                        <div className="alert alert--error" role="alert">
                            {response.message || 'Error al crear el canal. Por favor, intentá de nuevo.'}
                        </div>
                    )
                }

                {response && response.ok && !error ?
                    <div className="alert alert--success" role="alert">
                        Canal creado correctamente.
                    </div>
                    :
                    <form className="form" onSubmit={onSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label" htmlFor={FORM_CHANNEL_FIELD_NAMES.TITLE}>Titulo</label>
                            <input
                                className="form-input"
                                type="text"
                                id={FORM_CHANNEL_FIELD_NAMES.TITLE}
                                name={FORM_CHANNEL_FIELD_NAMES.TITLE}
                                placeholder="Ej: Nombre del canal"
                                onChange={handleChangeInput}
                                value={formState[FORM_CHANNEL_FIELD_NAMES.TITLE]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor={FORM_CHANNEL_FIELD_NAMES.DESCRIPTION}>Descripción</label>
                            <input
                                className="form-input"
                                type="text"
                                id={FORM_CHANNEL_FIELD_NAMES.DESCRIPTION}
                                name={FORM_CHANNEL_FIELD_NAMES.DESCRIPTION}
                                placeholder="¿De qué trata este canal?"
                                onChange={handleChangeInput}
                                value={formState[FORM_CHANNEL_FIELD_NAMES.DESCRIPTION]}
                                required
                            />
                        </div>

                        <button
                            className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creando canal...' : 'Crear canal'}
                        </button>

                        <Link to={`/workspaces/${workspace_id}`} className="btn btn--secondary">
                            Cancelar
                        </Link>
                    </form>
                }


                {response && response.ok && !error && <Link className='btn btn--primary' to={`/workspaces/${workspace_id}/${channel_id}`}>Ir al canal</Link>}
            </div>
        </div>
    );
};

export default CreateChannelScreen;