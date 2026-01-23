import { useState } from "react";
import "./ChatInput.css";
import { Button } from "./Button";
import { Send, FileText } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerateSummary?: () => void;
}

export function ChatInput({
  onSendMessage,
  onGenerateSummary,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="chat-input slide-up">
      <div className="chat-input__actions">
        <Button
          variant="secondary"
          size="sm"
          icon={<FileText size={18} />}
          onClick={onGenerateSummary}
        >
          Generar esquema
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="chat-input__form">
        <div className="chat-input__wrapper glass-strong">
          <input
            type="text"
            className="chat-input__field"
            placeholder="Escribe tu pregunta sobre Derecho..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Send size={18} />}
            disabled={!message.trim()}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
