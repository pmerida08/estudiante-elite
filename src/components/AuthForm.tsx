import { useState } from "react";
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
        setRegistrationSuccess(true);
        setEmail("");
        setPassword("");
        setFullName("");
        setTimeout(() => {
          setIsLogin(true);
          setRegistrationSuccess(false);
        }, 5000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(translateAuthError(err));
      } else {
        setError("Ocurrió un error. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src="/logoEstudianteElite.png"
            alt="Estudiante Elite Logo"
            className="auth-logo-img"
          />
          <h2 className="auth-title">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>
          <p className="auth-subtitle">
            Tu asistente inteligente para el estudio del Derecho
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="fullName" className="auth-label">
                <UserIcon size={16} />
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                className="auth-input"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              <Mail size={16} />
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              <Lock size={16} />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error animate-fade-in">{error}</div>}

          {registrationSuccess && (
            <div className="auth-success animate-fade-in">
              <CheckCircle size={20} />
              <div>
                <strong>🎓 ¡Bienvenido a Estudiante Elite!</strong>
                <p>
                  📧 Revisa tu correo electrónico y confirma tu cuenta para
                  acceder a tu tutor pedagógico de IA premium.
                </p>
              </div>
            </div>
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
                : "Crear mi cuenta"}
          </Button>
        </form>

        <div className="auth-toggle">
          <p className="auth-toggle-text">
            {isLogin ? "¿Aún no eres miembro?" : "¿Ya tienes una cuenta?"}
          </p>
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Regístrate gratis" : "Accede ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}
