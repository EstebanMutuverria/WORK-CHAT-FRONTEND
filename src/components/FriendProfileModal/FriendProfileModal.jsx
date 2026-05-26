import React from 'react'
import Modal from '../Modal/Modal'
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaSlash } from 'react-icons/fa'
import './FriendProfileModal.css'

/**
 * Componente FriendProfileModal:
 * Muestra el perfil público de un amigo de forma elegante y premium.
 * Reutiliza el componente genérico <Modal /> para garantizar la consistencia del diseño.
 */
const FriendProfileModal = ({ isOpen, onClose, friendInfo }) => {
    if (!isOpen || !friendInfo) return null

    const displayName = friendInfo.user_name || friendInfo.name || 'Usuario'

    /**
     * Genera las iniciales para el avatar en caso de que no tenga una imagen.
     */
    const getInitials = (name) => {
        if (!name) return '?'
        return name
            .split(' ')
            .filter(Boolean)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // Comprobamos qué redes sociales tiene configuradas
    const socials = []
    if (friendInfo.github) socials.push({ name: 'GitHub', url: friendInfo.github, icon: <FaGithub />, class: 'github' })
    if (friendInfo.linkedin) socials.push({ name: 'LinkedIn', url: friendInfo.linkedin, icon: <FaLinkedin />, class: 'linkedin' })
    if (friendInfo.twitter) socials.push({ name: 'Twitter', url: friendInfo.twitter, icon: <FaTwitter />, class: 'twitter' })
    if (friendInfo.instagram) socials.push({ name: 'Instagram', url: friendInfo.instagram, icon: <FaInstagram />, class: 'instagram' })

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Perfil del Amigo">
            <div className="friend-profile-body">
                {/* Sección del Avatar */}
                <div className="friend-profile-avatar-wrapper">
                    {friendInfo.url_image ? (
                        <img
                            src={friendInfo.url_image}
                            alt={displayName}
                            className="friend-profile-avatar"
                        />
                    ) : (
                        <div className="friend-profile-avatar">
                            {getInitials(displayName)}
                        </div>
                    )}
                </div>

                {/* Información Básica */}
                <div className="friend-profile-info">
                    <span className="friend-profile-badge">Amigo</span>
                    <h2 className="friend-profile-username">{displayName}</h2>
                    <div className="friend-profile-email-wrapper">
                        <FaEnvelope className="friend-profile-email-icon" />
                        <span>{friendInfo.email}</span>
                    </div>
                </div>

                <div className="friend-profile-divider"></div>

                {/* Sección de Redes Sociales */}
                <div className="friend-profile-socials">
                    <span className="friend-profile-socials-title">Redes Sociales</span>
                    {socials.length > 0 ? (
                        <div className={`friend-profile-social-buttons ${socials.length === 1 ? 'single-social' : ''}`}>
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`friend-social-btn friend-social-btn--${social.class}`}
                                    title={`Visitar perfil de ${social.name}`}
                                >
                                    {social.icon}
                                    <span>{social.name}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="friend-profile-no-socials">
                            <FaSlash style={{ fontSize: '0.8rem', opacity: 0.6 }} />
                            <span>No tiene redes sociales configuradas</span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default FriendProfileModal
