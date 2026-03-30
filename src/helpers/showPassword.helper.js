export function showPassword(inputId) {
    const passwordInput = document.getElementById(inputId)
    if (!passwordInput) return
    
    if (passwordInput.type === 'text') {
        passwordInput.type = 'password'
    } else {
        passwordInput.type = 'text'
    }
}