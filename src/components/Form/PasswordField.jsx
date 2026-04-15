import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

/**
 * A reusable password input component with built-in visibility toggle.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID and name
 * @param {string} props.value - Current value
 * @param {function} props.onChange - Change handler
 * @param {string} [props.placeholder='••••••••'] - Input placeholder
 * @param {boolean} [props.required=true] - Is field required
 * @param {string} [props.autoComplete] - Auto-complete attribute
 */
const PasswordField = ({ 
    id, 
    value, 
    onChange, 
    placeholder = '••••••••', 
    required = true,
    autoComplete
}) => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    return (
        <div className="form-input-eyebtn-container">
            <input
                className="form-input"
                type={isVisible ? 'text' : 'password'}
                id={id}
                name={id}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                autoComplete={autoComplete}
                required={required}
            />
            <button 
                type="button" 
                className="password-toggle-btn"
                onClick={toggleVisibility}
                aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    )
}

export default PasswordField
