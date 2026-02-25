export function validateEmail(email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export function passwordFeedback(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  if (!/[0-9]/.test(password)) return 'Password should include at least one number'
  return ''
}

export function isPasswordStrong(password) {
  return password && password.length >= 6 && /[0-9]/.test(password)
}
