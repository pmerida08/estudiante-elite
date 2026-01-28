import { X, Copy, Check, FileDown } from "lucide-react";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./SchemaModal.css";
import { Button } from "./Button";
import { Mermaid } from "./Mermaid";

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function SchemaModal({ isOpen, onClose, content }: SchemaModalProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    try {
      // Capture the full scrollable content with padding from CSS
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
        onclone: (documentClone) => {
          const container = documentClone.querySelector(
            ".schema-modal__content",
          ) as HTMLElement;
          const markdown = documentClone.querySelector(
            ".schema-modal__markdown",
          ) as HTMLElement;
          if (container && markdown) {
            container.classList.add("printing-mode");
            markdown.classList.add("printing-mode");
            // Remove scroll constraints during capture
            container.style.height = "auto";
            container.style.maxHeight = "none";
            container.style.overflow = "visible";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);

      // Scale image to fit page width
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let currentY = 0;

      // Add pages with proper positioning
      while (currentY < imgHeight) {
        if (currentY > 0) {
          pdf.addPage();
        }

        // Negative Y to shift the image up for subsequent pages
        pdf.addImage(imgData, "PNG", 0, -currentY, imgWidth, imgHeight);

        currentY += pdfHeight;
      }

      pdf.save(`esquema-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setIsExporting(false);
    }
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

        <div
          className="schema-modal__content custom-scrollbar"
          ref={contentRef}
        >
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
          <Button
            variant="secondary"
            icon={<FileDown size={18} />}
            onClick={handleDownloadPDF}
            disabled={isExporting}
          >
            {isExporting ? "Exportando..." : "PDF"}
          </Button>
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
