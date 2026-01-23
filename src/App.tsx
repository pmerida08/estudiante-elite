import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ThinkingIndicator } from "./components/ThinkingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function App() {
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

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Ahora",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Esta es una respuesta de demostración. En la versión completa, aquí se integraría con ChatGPT 5.2 para proporcionar respuestas pedagógicas personalizadas basadas en tus manuales de Derecho.",
        timestamp: "Ahora",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const handleGenerateSummary = () => {
    alert(
      "Funcionalidad de generación de esquemas en desarrollo. Esto exportará un PDF con el resumen de la conversación.",
    );
  };

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
