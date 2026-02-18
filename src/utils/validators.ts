export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos um número')
  }

  return { valid: errors.length === 0, errors }
}

export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false

  return true
}

export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  if (cleanCNPJ.length !== 14) return false

  let sum = 0
  let remainder

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ[i]) * (i === 0 ? 5 : i === 1 ? 4 : 12 - (i + 1))
  }

  remainder = sum % 11
  remainder = remainder < 2 ? 0 : 11 - remainder
  if (remainder !== parseInt(cleanCNPJ[12])) return false

  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ[i]) * (i === 0 ? 6 : i === 1 ? 5 : 13 - (i + 1))
  }

  remainder = sum % 11
  remainder = remainder < 2 ? 0 : 11 - remainder
  if (remainder !== parseInt(cleanCNPJ[13])) return false

  return true
}

export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

export function validatePlaca(placa: string): boolean {
  const placaRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/
  return placaRegex.test(placa.toUpperCase())
}

export function validateChassi(chassi: string): boolean {
  return chassi.length === 17
}

export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}