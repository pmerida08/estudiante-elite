import { motion } from "framer-motion";
import { clsx } from "clsx";
import "./ChatMessage.css";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={clsx("chat-message", `chat-message--${role}`)}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="chat-message__avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="chat-message__content">
        <div className="chat-message__bubble">
          <p className="chat-message__text">{content}</p>
        </div>
        {timestamp && (
          <div className="chat-message__timestamp">{timestamp}</div>
        )}
      </div>
    </motion.div>
  );
}
