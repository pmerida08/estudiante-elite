import { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./contexts/AuthContext";
import { sendMessageToTutor } from "./lib/n8n";
import { getMessages, saveMessage, createConversation } from "./lib/chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function App() {
  const { user, loading } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Initial welcome message
  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content:
      "¡Hola! Soy tu tutor de Derecho personalizado. ¿En qué puedo ayudarte hoy? Puedo explicarte conceptos, resolver dudas, o generar esquemas y resúmenes para facilitar tu estudio.",
    timestamp: "Ahora",
  };

  // Load messages when conversation changes
  useEffect(() => {
    async function loadHistory() {
      if (!activeConversationId) {
        setMessages([welcomeMessage]);
        return;
      }

      try {
        const history = await getMessages(activeConversationId);
        const mappedMessages: Message[] = history.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(
          mappedMessages.length > 0 ? mappedMessages : [welcomeMessage],
        );
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }

    if (user) loadHistory();
  }, [activeConversationId, user]);

  const handleSendMessage = async (content: string) => {
    let convId = activeConversationId;

    // Create a new conversation if none is active
    if (!convId) {
      try {
        const newConv = await createConversation(content.slice(0, 40) + "...");
        convId = newConv.id;
        setActiveConversationId(convId);
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

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

      // 1. Save user message to DB
      await saveMessage(convId, "user", content);

      // 2. Get tutor response
      const fullName = user.user_metadata?.full_name || "estudiante";
      const response = await sendMessageToTutor(content, user.id, fullName);

      // 3. Save assistant message to DB
      const savedAi = await saveMessage(convId, "assistant", response);

      const aiMessage: Message = {
        id: savedAi.id,
        role: "assistant",
        content: response,
        timestamp: "Ahora",
      };

      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: "error-" + Date.now(),
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
    alert("Funcionalidad de generación de esquemas en desarrollo.");
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
      <Sidebar
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={() => setActiveConversationId(null)}
      />

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
