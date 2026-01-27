import { useEffect, useState } from "react";
import "./ThinkingIndicator.css";

interface ThinkingIndicatorWithStatusProps {
  stage?: "analyzing" | "searching" | "generating";
}

export function ThinkingIndicatorWithStatus({
  stage = "analyzing",
}: ThinkingIndicatorWithStatusProps) {
  const [currentStage, setCurrentStage] = useState(stage);

  useEffect(() => {
    setCurrentStage(stage);
  }, [stage]);

  const getStatusText = () => {
    switch (currentStage) {
      case "analyzing":
        return "Analizando tu pregunta...";
      case "searching":
        return "Consultando la base de conocimientos...";
      case "generating":
        return "Generando respuesta...";
      default:
        return "Procesando...";
    }
  };

  return (
    <div className="thinking fade-in">
      <div className="thinking__avatar">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div className="thinking__bubble glass-strong">
        <div className="thinking__dots">
          <span className="thinking__dot" style={{ animationDelay: "0s" }} />
          <span className="thinking__dot" style={{ animationDelay: "0.2s" }} />
          <span className="thinking__dot" style={{ animationDelay: "0.4s" }} />
        </div>
        <div className="thinking__status">{getStatusText()}</div>
      </div>
    </div>
  );
}
