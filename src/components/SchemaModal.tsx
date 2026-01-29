import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./SchemaModal.css";
import { Button } from "./Button";
import { Mermaid } from "./Mermaid";

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

/**
 * Converts Markdown text to plain text suitable for pasting into DOCX
 * Removes Markdown syntax while preserving structure and readability
 */
function convertMarkdownToPlainText(markdown: string): string {
  let text = markdown;

  // Remove code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove inline code (`code`)
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove headers (# ## ### etc.) but keep the text
  text = text.replace(/^#{1,6}\s+(.+)$/gm, "$1");

  // Remove bold (**text** or __text__)
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");

  // Remove italic (*text* or _text_)
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");

  // Remove strikethrough (~~text~~)
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove links but keep text [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Remove bullet points (-, *, +) but keep indentation
  text = text.replace(/^[\s]*[-*+]\s+/gm, "");

  // Remove numbered lists (1. 2. etc.) but keep text
  text = text.replace(/^[\s]*\d+\.\s+/gm, "");

  // Remove horizontal rules (---, ***, ___)
  text = text.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, "");

  // Remove blockquotes (>) but keep text
  text = text.replace(/^>\s+/gm, "");

  // Clean up multiple consecutive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  // Trim whitespace from start and end
  text = text.trim();

  return text;
}

export function SchemaModal({ isOpen, onClose, content }: SchemaModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const plainText = convertMarkdownToPlainText(content);
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="schema-modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="schema-modal animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="schema-modal__header">
          <div className="schema-modal__title-group">
            <h2 className="schema-modal__title">Esquema de Estudio</h2>
            <p className="schema-modal__subtitle">
              Generado automáticamente por tu Tutor Elite
            </p>
          </div>
          <button className="schema-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="schema-modal__content custom-scrollbar">
          <div className="schema-modal__markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match && match[1] === "mermaid") {
                    return (
                      <Mermaid chart={String(children).replace(/\n$/, "")} />
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        <footer className="schema-modal__footer">
          <Button
            variant="secondary"
            icon={copied ? <Check size={18} /> : <Copy size={18} />}
            onClick={handleCopy}
            className="schema-modal__copy-btn"
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
