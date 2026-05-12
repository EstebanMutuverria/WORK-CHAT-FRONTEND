import React, { useEffect, useState, useRef } from 'react';
import { IoSend, IoClose } from 'react-icons/io5';
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { createMessage } from '../../service/message.service.js';
import './Messages.css';
import { MdOutlineAttachFile } from "react-icons/md";

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
        resetForm
    } = useForm({ initialFormState, submitFn: onSubmitMessage })

    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);

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
    }, [response, onMessageSent])

    function onSubmitMessage(formState) {
        if (!formState[FORM_FIELDS_NAME.CONTENT].trim() && !selectedFile) return;

        sendRequest({
            requestCb: async () => {
                return await createMessage(workspace_id, channel_id, formState[FORM_FIELDS_NAME.CONTENT], selectedFile)
            }
        })
    }

    return (
        <div className="message-input-container">
            <form onSubmit={onSubmit} className="message-input-form">
                {selectedFile && (
                    <div className="file-preview-container">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="image-preview" />
                        ) : (
                            <div className="generic-file-preview">
                                <span>{selectedFile.name}</span>
                            </div>
                        )}
                        <button type="button" onClick={handleCancelFile} className="cancel-file-btn">
                            <IoClose />
                        </button>
                    </div>
                )}
                <textarea
                    name={FORM_FIELDS_NAME.CONTENT}
                    id={FORM_FIELDS_NAME.CONTENT}
                    placeholder='Escribe tu mensaje...'
                    onChange={handleChangeInput}
                    value={formState[FORM_FIELDS_NAME.CONTENT]}
                    className="message-input-field"
                    autoComplete='off'
                    required={!selectedFile}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                />
                <div className="message-input-controls">
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
                        title="Subir archivo"
                        className="add-file-btn"
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                    >
                        <MdOutlineAttachFile />
                    </button>
                    <button
                        type="submit"
                        disabled={loading || (!formState[FORM_FIELDS_NAME.CONTENT].trim() && !selectedFile)}
                        className="send-btn"
                        title="Enviar mensaje"
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                        ) : (
                            <IoSend />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
