export function showPassword(inputId) {
    let isVisible = false
    const passwordInput = document.getElementById(inputId)
    if (!passwordInput) return

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        isVisible = true
    } else {
        passwordInput.type = 'password'
        isVisible = false
    }

    return isVisible
}