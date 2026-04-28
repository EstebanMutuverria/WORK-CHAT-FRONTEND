import React, { useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { createMessage } from '../../service/message.service.js';
import './Messages.css';

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

    const {
        sendRequest,
        response,
        loading
    } = useRequest()

    useEffect(() => {
        if (response && response.ok) {
            resetForm()
            onMessageSent()
        }
    }, [response])

    function onSubmitMessage(formState) {
        if (!formState[FORM_FIELDS_NAME.CONTENT].trim()) return;
        
        sendRequest({
            requestCb: async () => {
                return await createMessage(workspace_id, channel_id, formState[FORM_FIELDS_NAME.CONTENT])
            }
        })
    }

    return (
        <div className="message-input-container">
            <form onSubmit={onSubmit} className="message-input-form">
                <textarea
                    name={FORM_FIELDS_NAME.CONTENT}
                    id={FORM_FIELDS_NAME.CONTENT}
                    placeholder='Escribe tu mensaje...'
                    onChange={handleChangeInput}
                    value={formState[FORM_FIELDS_NAME.CONTENT]}
                    className="message-input-field"
                    autoComplete='off'
                    required
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                />
                <div className="message-input-controls">
                    <button
                        type="submit"
                        disabled={loading || !formState[FORM_FIELDS_NAME.CONTENT].trim()}
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