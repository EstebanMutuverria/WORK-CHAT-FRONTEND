import React, { useEffect } from 'react'
import { Link } from 'react-router'
import useWorkSpaces from '../../hooks/useWorkspaces.jsx'
import './HomeScreen.css'

const HomeScreen = () => {

    const {
        response,
        loading,
        error,
        workspaces
    } = useWorkSpaces()

    return (
        <div className="home-page">

            {loading && (
                <div className="loading-state">
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Cargando espacios de trabajo...</span>
                </div>
            )}

            {!loading && response && response.ok && workspaces.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">🏢</div>
                    <h2 className="empty-state__title">No tenés espacios de trabajo</h2>
                    <p className="empty-state__description">
                        Creá tu primer espacio de trabajo para empezar a colaborar con tu equipo.
                    </p>
                    <Link className="btn btn--primary" style={{ width: 'auto' }} to="/create-workspace">
                        Crear espacio de trabajo
                    </Link>
                </div>
            )}

            {!loading && response && response.ok && workspaces.length > 0 && (
                <>
                    <div className="home-hero">
                        <h1 className="home-hero__title">Bienvenido 👋</h1>
                        <p className="home-hero__subtitle">Seleccioná el espacio de trabajo al que querés acceder.</p>
                        <br />
                        <Link className="btn btn--primary" style={{ width: 'auto' }} to="/create-workspace">
                            Crear espacio de trabajo
                        </Link>
                    </div>

                    <div className="workspace-grid">
                        {workspaces.map(
                            (workspace) => (
                                <div className="workspace-card" key={workspace.workspace_id}>
                                    <div className="workspace-card__icon">🏢</div>
                                    <div className="workspace-card__body">
                                        <h2 className="workspace-card__name">{workspace.workspace_title}</h2>
                                        <p className="workspace-card__meta">Espacio de trabajo</p>
                                        <Link
                                            className="btn btn--workspace"
                                            to={'/workspaces/' + workspace.workspace_id}
                                        >
                                            Abrir espacio →
                                        </Link>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </>
            )}

            {error && (
                <div className="empty-state">
                    <div className="empty-state__icon">⚠️</div>
                    <h2 className="empty-state__title">Error al cargar</h2>
                    <p className="empty-state__description">{error.message}</p>
                </div>
            )}

        </div>
    )
}

export default HomeScreen