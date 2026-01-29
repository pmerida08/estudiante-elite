import { X, Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./SchemaModal.css";
import { Button } from "./Button";

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

/**
 * Converts Markdown text to visually formatted plain text suitable for pasting into DOCX
 * Preserves formatting using Unicode characters and spacing
 */
function convertMarkdownToPlainText(markdown: string): string {
  let text = markdown;

  // Remove code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove inline code (`code`)
  text = text.replace(/`([^`]+)`/g, "$1");

  // Convert headers to uppercase with separators for visual hierarchy
  // H1: TITLE with double line separator
  text = text.replace(/^#\s+(.+)$/gm, (_match, title) => {
    return `\n${"═".repeat(60)}\n${title.toUpperCase()}\n${"═".repeat(60)}\n`;
  });

  // H2: SUBTITLE with single line separator
  text = text.replace(/^##\s+(.+)$/gm, (_match, subtitle) => {
    return `\n${"─".repeat(50)}\n${subtitle.toUpperCase()}\n${"─".repeat(50)}`;
  });

  // H3: Title Case with dots
  text = text.replace(/^###\s+(.+)$/gm, (_match, title) => {
    return `\n• ${title} •`;
  });

  // H4-H6: Just bold
  text = text.replace(/^#{4,6}\s+(.+)$/gm, "$1");

  // Convert bold (**text** or __text__) to UPPERCASE
  text = text.replace(/(\*\*|__)(.+?)\1/g, (_match, _marker, content) => {
    return content.toUpperCase();
  });

  // Convert italic (*text* or _text_) to keep as is but with emphasis markers
  text = text.replace(/(\*|_)(.+?)\1/g, (_match, _marker, content) => {
    return `「${content}」`;
  });

  // Remove strikethrough (~~text~~) but keep text
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove links but keep text [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Convert bullet points to proper bullets with indentation
  text = text.replace(/^(\s*)[-*+]\s+/gm, (_match, indent) => {
    const level = Math.floor(indent.length / 2);
    const bullets = ["●", "○", "▪", "▫"];
    return `${"  ".repeat(level)}${bullets[level % bullets.length]} `;
  });

  // Convert numbered lists to proper numbering with indentation
  text = text.replace(/^(\s*)(\d+)\.\s+/gm, (_match, indent, num) => {
    const level = Math.floor(indent.length / 2);
    return `${"  ".repeat(level)}${num}. `;
  });

  // Remove horizontal rules (---, ***, ___)
  text = text.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, "");

  // Remove blockquotes (>) but keep text with quote marks
  text = text.replace(/^>\s+(.+)$/gm, "  » $1");

  // Clean up multiple consecutive blank lines (max 2)
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

  const handleDownload = () => {
    // Normalize line endings to LF (Unix style) for better compatibility
    const normalizedContent = content.replace(/\r\n/g, "\n");

    // Create blob with explicit UTF-8 encoding
    const blob = new Blob([normalizedContent], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().split("T")[0];
    a.download = `resumen-estudio-${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="schema-modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="schema-modal animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="schema-modal__header">
          <div className="schema-modal__title-group">
            <h2 className="schema-modal__title">Resumen de Estudio</h2>
            <p className="schema-modal__subtitle">
              Listo para importar a Notion
            </p>
          </div>
          <button className="schema-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="schema-modal__content custom-scrollbar">
          <div className="schema-modal__markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
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
          <Button
            variant="secondary"
            icon={<Download size={18} />}
            onClick={handleDownload}
          >
            Descargar .md
          </Button>
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
