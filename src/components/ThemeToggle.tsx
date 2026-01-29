import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./ThemeToggle.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={20} className="theme-toggle__icon" />
      ) : (
        <Sun size={20} className="theme-toggle__icon" />
      )}
    </button>
  );
}
