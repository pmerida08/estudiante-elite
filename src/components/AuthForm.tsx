import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./Button";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";
import { translateAuthError } from "../lib/errorMessages";
import "./AuthForm.css";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRegistrationSuccess(false);
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error("Por favor ingresa tu nombre completo");
        }
        await signUp(email, password, fullName);

        // Show success message
        setRegistrationSuccess(true);

        // Clear form after successful registration
        setEmail("");
        setPassword("");
        setFullName("");

        // Switch to login view after 5 seconds
        setTimeout(() => {
          setIsLogin(true);
          setRegistrationSuccess(false);
        }, 5000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Translate error message to Spanish
        setError(translateAuthError(err));
      } else {
        setError("Ocurrió un error. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card glass-strong"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-header">
          <h1 className="auth-logo">Estudiante Elite</h1>
          <p className="auth-subtitle">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="fullName" className="auth-label">
                <UserIcon size={18} />
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                className="auth-input glass"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              <Mail size={18} />
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="auth-input glass"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              <Lock size={18} />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="auth-input glass"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {registrationSuccess && (
            <motion.div
              className="auth-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={20} />
              <div>
                <strong>¡Cuenta creada exitosamente!</strong>
                <p>
                  Por favor revisa tu correo electrónico para confirmar tu
                  cuenta antes de iniciar sesión.
                </p>
              </div>
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            disabled={loading}
            className="auth-submit"
          >
            {loading
              ? "Cargando..."
              : isLogin
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </Button>
        </form>

        <div className="auth-toggle">
          <p className="auth-toggle-text">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          </p>
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
