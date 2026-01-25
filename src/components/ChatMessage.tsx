import { clsx } from "clsx";
import "./ChatMessage.css";
import { User, Bot } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={clsx("chat-message fade-in", `chat-message--${role}`)}>
      <div className="chat-message__avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="chat-message__content">
        <div className="chat-message__bubble">
          <div className="chat-message__text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
        {timestamp && (
          <div className="chat-message__timestamp">{timestamp}</div>
        )}
      </div>
    </div>
  );
}
