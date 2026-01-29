/**
 * Translates Supabase authentication error messages to Spanish
 */
export function translateAuthError(error: Error): string {
  const message = error.message.toLowerCase();

  // Email/Password validation errors
  if (message.includes("invalid login credentials")) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
  }

  if (message.includes("email not confirmed")) {
    return "🎓 Por favor, verifica tu correo electrónico para activar tu cuenta Elite y comenzar tu experiencia de estudio premium.";
  }

  if (message.includes("user already registered")) {
    return "Este correo electrónico ya está registrado.";
  }

  if (message.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (message.includes("invalid email")) {
    return "El formato del correo electrónico no es válido.";
  }

  if (message.includes("email address is invalid")) {
    return "El correo electrónico no es válido.";
  }

  if (message.includes("user not found")) {
    return "No existe una cuenta con este correo electrónico.";
  }

  if (message.includes("email rate limit exceeded")) {
    return "Demasiados intentos. Por favor espera unos minutos antes de intentar de nuevo.";
  }

  if (message.includes("signup disabled")) {
    return "El registro de nuevas cuentas está temporalmente deshabilitado.";
  }

  if (message.includes("invalid password")) {
    return "La contraseña no es válida.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch")) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  // Generic fallback
  return "Ocurrió un error. Por favor intenta de nuevo.";
}
