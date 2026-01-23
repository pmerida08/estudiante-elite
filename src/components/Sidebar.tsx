import { motion } from "framer-motion";
import { clsx } from "clsx";
import "./Sidebar.css";
import { Button } from "./Button";
import { MessageSquarePlus, User } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
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
            <div className="sidebar__user-name">Estudiante</div>
            <div className="sidebar__user-status">En línea</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
