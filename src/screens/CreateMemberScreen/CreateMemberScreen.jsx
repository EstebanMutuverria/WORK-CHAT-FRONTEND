import React from 'react'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { Link, useParams } from 'react-router'
import { createMember } from '../../service/member.service'

const CreateMemberScreen = () => {

    const workspace_id = useParams().workspace_id
    const {
        response,
        error,
        loading,
        sendRequest
    } = useRequest()

    const CREATE_MEMBER_FIELD_NAMES = {
        EMAIL: 'email',
        ROLE: 'role'
    }

    const initialFormState = {
        [CREATE_MEMBER_FIELD_NAMES.EMAIL]: '',
        [CREATE_MEMBER_FIELD_NAMES.ROLE]: 'user'
    }

    function onCreateMember(formState) {
        sendRequest(
            {
                requestCb: async () => {
                    return await createMember(
                        workspace_id,
                        formState[CREATE_MEMBER_FIELD_NAMES.EMAIL],
                        formState[CREATE_MEMBER_FIELD_NAMES.ROLE]
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
    } = useForm({ initialFormState: initialFormState, submitFn: onCreateMember })

    return (
        <div>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-card__brand">
                        <div className="auth-card__logo">👤</div>
                        <span className="auth-card__app-name">WorkChat</span>
                    </div>

                    <div>
                        <h1 className="auth-card__title">Invitar miembro</h1>
                        <p className="auth-card__subtitle">Invita a un nuevo miembro para que empiece a interactuar en el espacio de trabajo</p>
                    </div>

                    {error && (
                        <div className="alert alert--error" role="alert">
                            {error.message || 'Error agregar miembro. Por favor, intentá de nuevo.'}
                        </div>
                    )}

                    {response && !response.ok && (
                        <div className="alert alert--error" role="alert">
                            {response.message || 'Error al agregar miembro. Por favor, intentá de nuevo.'}
                        </div>
                    )}

                    {response && response.ok && !error ? (
                        <div className="alert alert--success" role="alert">
                            Miembro invitado correctamente.
                        </div>
                    ) : (
                        <form className="form" onSubmit={onSubmit} noValidate>

                            <div className="form-group">
                                <label className="form-label" htmlFor={CREATE_MEMBER_FIELD_NAMES.EMAIL}>Email</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    id={CREATE_MEMBER_FIELD_NAMES.EMAIL}
                                    name={CREATE_MEMBER_FIELD_NAMES.EMAIL}
                                    placeholder="Ej: usuario@gmail.com"
                                    onChange={handleChangeInput}
                                    value={formState[CREATE_MEMBER_FIELD_NAMES.EMAIL]}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor={CREATE_MEMBER_FIELD_NAMES.ROLE}>Rol</label>
                                <select
                                    className="form-input"
                                    type="select"
                                    id={CREATE_MEMBER_FIELD_NAMES.ROLE}
                                    name={CREATE_MEMBER_FIELD_NAMES.ROLE}
                                    placeholder="¿De qué trata este espacio?"
                                    onChange={handleChangeInput}
                                    value={formState[CREATE_MEMBER_FIELD_NAMES.ROLE]}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <button
                                className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Invitando miembro...' : 'Invitar miembro'}
                            </button>

                            <Link to={`/workspaces/${workspace_id}`} className="btn btn--secondary">
                                Cancelar
                            </Link>
                        </form>
                    )}

                    {response && response.ok && !error && <Link className='btn btn--primary' to={`/workspaces/${workspace_id}`}>Volver</Link>}
                </div>
            </div>
        </div>
    )
}

export default CreateMemberScreen