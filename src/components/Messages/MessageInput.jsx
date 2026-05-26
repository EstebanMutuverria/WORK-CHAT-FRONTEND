import React, { useEffect, useState, useRef } from 'react';
import { IoSend, IoClose, IoHappyOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { createMessage } from '../../service/message.service.js';
import './Messages.css';
import { MdOutlineAttachFile, MdOutlineImage } from "react-icons/md";

const MessageInput = ({ workspace_id, channel_id, onMessageSent }) => {
    const FORM_FIELDS_NAME = {
        CONTENT: 'content'
    }

    const initialFormState = {
        [FORM_FIELDS_NAME.CONTENT]: ''
    }

    const {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    } = useForm({ initialFormState, submitFn: onSubmitMessage })

    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleCancelFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const {
        sendRequest,
        response,
        loading
    } = useRequest()

    useEffect(() => {
        if (response && response.ok) {
            resetForm()
            handleCancelFile()
            if (onMessageSent) onMessageSent()
        }
    }, [response])

    // Cerrar el selector de emojis al hacer clic afuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-ajustar la altura del textarea dinámicamente al escribir
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
        }
    }, [formState[FORM_FIELDS_NAME.CONTENT]]);

    const handleEmojiSelect = (emoji) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formState[FORM_FIELDS_NAME.CONTENT] || '';
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const newValue = before + emoji + after;

        setFields({ [FORM_FIELDS_NAME.CONTENT]: newValue });

        // Devolver el foco al textarea y posicionar el cursor después del emoji insertado
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + emoji.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    function onSubmitMessage(formState) {
        if (!formState[FORM_FIELDS_NAME.CONTENT].trim() && !selectedFile) return;

        sendRequest({
            requestCb: async () => {
                return await createMessage(workspace_id, channel_id, formState[FORM_FIELDS_NAME.CONTENT], selectedFile)
            }
        })
    }

    return (
        <div className="message-input-container" style={{ position: 'relative' }}>
            {showEmojiPicker && (
                <div className="emoji-picker-popup" ref={emojiPickerRef}>
                    <EmojiPicker
                        onEmojiClick={(emojiData) => handleEmojiSelect(emojiData.emoji)}
                        theme="dark"
                        searchPlaceholder="Buscar emoji..."
                        width="100%"
                        height={350}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                    />
                </div>
            )}

            <form onSubmit={onSubmit} className="message-input-form-modern">
                {selectedFile && (
                    <div className="file-preview-glass-container">
                        <div className="file-preview-wrapper">
                            {filePreview ? (
                                <img src={filePreview} alt="Preview" className="modern-image-preview" />
                            ) : (
                                <div className="modern-generic-file-preview">
                                    <MdOutlineImage className="file-icon" />
                                    <span>{selectedFile.name}</span>
                                </div>
                            )}
                            <button type="button" onClick={handleCancelFile} className="modern-cancel-file-btn" title="Quitar archivo">
                                <IoClose />
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="message-input-row">
                    <textarea
                        ref={textareaRef}
                        name={FORM_FIELDS_NAME.CONTENT}
                        id={FORM_FIELDS_NAME.CONTENT}
                        placeholder='Escribe un mensaje aquí...'
                        onChange={handleChangeInput}
                        value={formState[FORM_FIELDS_NAME.CONTENT]}
                        className="message-input-field-modern"
                        autoComplete='off'
                        required={!selectedFile}
                        autoFocus
                        rows="1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSubmit(e);
                            }
                        }}
                    />
                </div>

                <div className="message-input-action-bar">
                    <div className="message-input-left-tools">
                        <input
                            type="file"
                            id="file-input"
                            className="file-input"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            accept="image/*"
                        />
                        <button
                            type="button"
                            title="Subir imagen o archivo"
                            className="tool-btn-modern attach-btn"
                            onClick={() => fileInputRef.current.click()}
                            disabled={loading}
                        >
                            <MdOutlineAttachFile />
                        </button>
                        
                        <button
                            type="button"
                            title="Emojis"
                            className={`tool-btn-modern emoji-btn ${showEmojiPicker ? 'active' : ''}`}
                            disabled={loading}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <IoHappyOutline />
                        </button>
                    </div>

                    <div className="message-input-right-tools">
                        <button
                            type="submit"
                            disabled={loading || (!formState[FORM_FIELDS_NAME.CONTENT].trim() && !selectedFile)}
                            className="send-btn-modern"
                            title="Enviar mensaje"
                        >
                            {loading ? (
                                <div className="modern-spinner"></div>
                            ) : (
                                <IoSend className="send-icon" />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;

