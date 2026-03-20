export function isEmailValid(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

export function isCpfValid(cpf: string) {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  let soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(clean.substring(i - 1, i)) * (11 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(clean.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(clean.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(clean.substring(10, 11));
}

export function isPasswordStrong(s: string) {
  return s.length >= 6;
}

