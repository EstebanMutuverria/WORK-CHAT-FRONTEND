import React, { useEffect } from 'react';
import './WelcomeIntro.css';

const WelcomeIntro = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2800); // Duración de la animación

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="welcome-intro">
            <div className="welcome-intro__background">
                <div className="welcome-intro__blob welcome-intro__blob--1"></div>
                <div className="welcome-intro__blob welcome-intro__blob--2"></div>
            </div>
            
            <div className="welcome-intro__content">
                <div className="welcome-intro__logo">
                    <span>W</span>
                </div>
                <h1 className="welcome-intro__title">Iniciando WorkChat</h1>
                <p className="welcome-intro__subtitle">Preparando tu espacio de trabajo...</p>
                
                <div className="welcome-intro__loader-container">
                    <div className="welcome-intro__loader-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeIntro;
