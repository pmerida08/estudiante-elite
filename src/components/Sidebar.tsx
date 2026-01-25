import { useState, useEffect } from "react";
import { clsx } from "clsx";
import "./Sidebar.css";
import { Button } from "./Button";
import { MessageSquarePlus, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getConversations } from "../lib/chat";
import type { Conversation } from "../lib/chat";

interface SidebarProps {
  className?: string;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  className,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Get full name from user metadata
  const fullName = user?.user_metadata?.full_name || "Estudiante";

  useEffect(() => {
    async function loadConversations() {
      if (!user) return;
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [user, activeConversationId]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    return `${diffDays} días atrás`;
  };

  return (
    <aside className={clsx("sidebar animate-slide-in-left", className)}>
      <div className="sidebar__header">
        <h1 className="sidebar__logo">Estudiante Elite</h1>
      </div>

      <div className="sidebar__content">
        <Button
          variant="primary"
          size="md"
          icon={<MessageSquarePlus size={20} />}
          className="sidebar__new-chat"
          onClick={onNewChat}
        >
          Nueva conversación
        </Button>

        <div className="sidebar__history">
          <h3 className="sidebar__history-title">Historial</h3>
          <div className="sidebar__conversations">
            {loading ? (
              <div className="sidebar__loading">Cargando...</div>
            ) : conversations.length === 0 ? (
              <div className="sidebar__empty">No hay sesiones aún</div>
            ) : (
              conversations.map((conv, index) => (
                <div
                  key={conv.id}
                  className={clsx(
                    "sidebar__conversation animate-fade-in",
                    activeConversationId === conv.id &&
                      "sidebar__conversation--active",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="sidebar__conversation-title">
                    {conv.title}
                  </div>
                  <div className="sidebar__conversation-date">
                    {formatDate(conv.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            <User size={20} />
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{fullName}</div>
            <div className="sidebar__user-status">En línea</div>
          </div>
          <button
            className="sidebar__logout"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
