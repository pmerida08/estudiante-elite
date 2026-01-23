import { motion } from "framer-motion";
import { clsx } from "clsx";
import "./Sidebar.css";
import { Button } from "./Button";
import { MessageSquarePlus, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, signOut } = useAuth();

  // Get full name from user metadata
  const fullName = user?.user_metadata?.full_name || "Estudiante";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Mock conversation history
  const conversations = [
    { id: "1", title: "Derecho Civil - Contratos", date: "Hoy" },
    { id: "2", title: "Derecho Penal - Delitos", date: "Ayer" },
    { id: "3", title: "Derecho Constitucional", date: "2 días atrás" },
  ];

  return (
    <motion.aside
      className={clsx("sidebar", className)}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar__header">
        <h1 className="sidebar__logo">Estudiante Elite</h1>
      </div>

      <div className="sidebar__content">
        <Button
          variant="primary"
          size="md"
          icon={<MessageSquarePlus size={20} />}
          className="sidebar__new-chat"
        >
          Nueva conversación
        </Button>

        <div className="sidebar__history">
          <h3 className="sidebar__history-title">Historial</h3>
          <div className="sidebar__conversations">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                className="sidebar__conversation"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="sidebar__conversation-title">{conv.title}</div>
                <div className="sidebar__conversation-date">{conv.date}</div>
              </motion.div>
            ))}
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
    </motion.aside>
  );
}
