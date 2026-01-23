import "./ThinkingIndicator.css";

export function ThinkingIndicator() {
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
      </div>
    </div>
  );
}
