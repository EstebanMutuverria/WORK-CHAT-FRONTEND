import { useState } from "react"

/* 

Este hook centraliza una forma de extraer informacion del formulario y sincronizarlo con un estado
EJ:
El usuario crea un workspace con title y description
Hay un estado interno donde se guarda el valor actual del campo title y description
    form_state = {
        title: 'test',
        description: ''
    }
*/

function useForm({ initialFormState, submitFn }) {
    const [formState, setFormState] = useState(
        initialFormState
    )

    function handleChangeInput(event) {
        const { name, value, type, files } = event.target

        setFormState((prev) => {
            const newState = { ...prev }

            if (type === 'file') {
                const file = files[0]
                newState[name] = file
                // If it's an image, create a preview
                if (file && file.type.startsWith('image/')) {
                    newState[`${name}Preview`] = URL.createObjectURL(file)
                }
            } else {
                newState[name] = value
            }

            return newState
        })
    }

    function setFields(fields) {
        setFormState((prev) => ({
            ...prev,
            ...fields
        }))
    }

    function onSubmit(event) {
        event.preventDefault()
        submitFn(formState)
    }

    function resetForm() {
        setFormState(initialFormState)
    }

    return {
        handleChangeInput,
        onSubmit,
        formState,
        setFields,
        resetForm
    }
}

export default useForm