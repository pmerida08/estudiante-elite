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
    <div className="chat-input animate-fade-in">
      <div className="chat-input__container">
        <form onSubmit={handleSubmit} className="chat-input__form">
          <div className="chat-input__wrapper">
            <input
              type="text"
              className="chat-input__field"
              placeholder="Hazme cualquier consulta jurídica..."
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
              Consultar
            </Button>
          </div>
        </form>

        <div className="chat-input__actions">
          <Button
            variant="ghost"
            size="sm"
            icon={<FileText size={16} />}
            onClick={onGenerateSummary}
            className="chat-input__action-btn"
          >
            Generar esquema de estudio
          </Button>
        </div>
      </div>
    </div>
  );
}
