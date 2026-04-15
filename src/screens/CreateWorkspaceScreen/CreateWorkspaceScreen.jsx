import React, { useState } from 'react'
import { createWorkspace } from '../../service/workspace.service.js'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { Link } from 'react-router'
import '../../styles/auth.css'

const CreateWorkspaceScreen = () => {
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const CREATE_WORKSPACE_FIELD_NAMES = {
        TITLE: 'title',
        DESCRIPTION: 'description'
    }

    const InitialFormState = {
        [CREATE_WORKSPACE_FIELD_NAMES.TITLE]: '',
        [CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION]: ''
    }

    const {
        sendRequest,
        response,
        error,
        loading
    } = useRequest()

    function onCreateWorkspace(formState) {
        sendRequest({
            requestCb: async () => {
                return await createWorkspace({
                    title: formState[CREATE_WORKSPACE_FIELD_NAMES.TITLE],
                    description: formState[CREATE_WORKSPACE_FIELD_NAMES.DESCRIPTION],
                    image: imageFile
                })
            }
        })
    }

    const {
        handleChangeInput,
        onSubmit,
        formState
    } = useForm({ initialFormState: InitialFormState, submitFn: onCreateWorkspace })

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Helper to get initials for the discord-style icon preview
    const getInitials = (title) => {
        if (!title) return '?'
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

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

                {response && !response.ok && (
                    <div className="alert alert--error" role="alert">
                        {response.message || 'Error al crear el espacio. Por favor, intentá de nuevo.'}
                    </div>
                )}

                {response && response.ok && !error ? (
                    <div className="alert alert--success" role="alert">
                        Espacio de trabajo creado correctamente.
                    </div>
                ) : (
                    <form className="form" onSubmit={onSubmit} noValidate>
                        {/* ICON PREVIEW SECTION */}
                        <div className="workspace-icon-preview-container">
                            <div className="workspace-icon-preview">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="workspace-icon-img" />
                                ) : (
                                    <div className="workspace-icon-initials">
                                        {getInitials(formState[CREATE_WORKSPACE_FIELD_NAMES.TITLE])}
                                    </div>
                                )}
                            </div>
                            <p className="workspace-icon-help">Previsualización de tu espacio</p>
                        </div>

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
                            <label className="form-label" htmlFor="workspace_image">Imagen (Opcional)</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="workspace_image"
                                    name="image"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                    className="form-input-file"
                                />
                                <label htmlFor="workspace_image" className="btn btn--secondary file-input-label">
                                    {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                                </label>
                                {imageFile && <span className="file-name">{imageFile.name}</span>}
                            </div>
                            <p className="form-help-text">Formatos permitidos: JPG, PNG. Máximo 2MB.</p>
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
                )}

                {response && response.ok && !error && <Link className='btn btn--primary' to="/home">Volver al inicio</Link>}
            </div>
        </div>
    )
}

export default CreateWorkspaceScreen