import { clsx } from "clsx";
import "./ChatMessage.css";
import { User, Bot, CheckCircle2, AlertCircle, Info } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  responseTime?: number; // in seconds
}

export function ChatMessage({
  role,
  content,
  timestamp,
  responseTime,
}: ChatMessageProps) {
  const isUser = role === "user";

  // Custom renderers for markdown elements
  const components: Components = {
    // Enhanced code blocks
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      return (
        <div className="code-block-wrapper">
          {match && (
            <div className="code-block-header">
              <span className="code-block-language">{match[1]}</span>
            </div>
          )}
          <pre>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },

    // Enhanced blockquotes with icons
    blockquote: ({ children }) => {
      const content = String(children);
      let icon = <Info size={18} />;
      let className = "blockquote-info";

      // Detect special blockquote types
      if (content.includes("importante") || content.includes("Importante")) {
        icon = <AlertCircle size={18} />;
        className = "blockquote-important";
      } else if (content.includes("correcto") || content.includes("✓")) {
        icon = <CheckCircle2 size={18} />;
        className = "blockquote-success";
      }

      return (
        <blockquote className={className}>
          <div className="blockquote-icon">{icon}</div>
          <div className="blockquote-content">{children}</div>
        </blockquote>
      );
    },

    // Enhanced headings with anchors
    h1: ({ children }) => (
      <h1 className="heading-with-icon">
        <span className="heading-number">📚</span>
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="heading-with-icon">
        <span className="heading-number">📖</span>
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="heading-with-icon">
        <span className="heading-number">📝</span>
        {children}
      </h3>
    ),
  };

  return (
    <div className={clsx("chat-message fade-in", `chat-message--${role}`)}>
      <div className="chat-message__avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="chat-message__content">
        <div className="chat-message__bubble">
          <div className="chat-message__text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="chat-message__meta">
          {timestamp && (
            <span className="chat-message__timestamp">{timestamp}</span>
          )}
          {!isUser && responseTime && (
            <span className="chat-message__response-time">
              · {responseTime}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
