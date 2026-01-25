import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./contexts/AuthContext";
import { sendMessageToTutor } from "./lib/n8n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function App() {
  const { user, loading } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy tu tutor de Derecho personalizado. ¿En qué puedo ayudarte hoy? Puedo explicarte conceptos, resolver dudas, o generar esquemas y resúmenes para facilitar tu estudio.",
      timestamp: "Ahora",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Ahora",
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      if (!user) throw new Error("Debes iniciar sesión para chatear");

      const fullName = user.user_metadata?.full_name || "estudiante";
      const response = await sendMessageToTutor(content, user.id, fullName);

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: "Ahora",
      };

      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Lo siento, hubo un problema al conectar con el tutor. Por favor, inténtalo de nuevo en unos momentos.",
        timestamp: "Ahora",
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleGenerateSummary = () => {
    alert(
      "Funcionalidad de generación de esquemas en desarrollo. Esto exportará un PDF con el resumen de la conversación.",
    );
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="thinking-indicator">
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
          </div>
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  // Show AuthForm if user is not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Show Chat interface if user is authenticated
  return (
    <div className="app">
      <Sidebar />

      <main className="app__main">
        <header className="app__header glass">
          <div className="app__header-content">
            <h2 className="app__header-title">Sesión de estudio</h2>
            <div className="app__header-status">
              <span className="app__status-indicator"></span>
              <span className="app__status-text">Activo</span>
            </div>
          </div>
        </header>

        <div className="app__chat">
          <div className="app__messages">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isThinking && <ThinkingIndicator />}
          </div>
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          onGenerateSummary={handleGenerateSummary}
        />
      </main>
    </div>
  );
}

export default App;
