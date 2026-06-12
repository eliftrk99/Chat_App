"use client";

import { MessageCircle, Users, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";

export default function Sidebar({ activePage }) {
  const { isDark, toggleTheme } = useTheme();

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 gap-4 z-20"
        style={{
          backgroundColor: isDark ? "#111111" : "#1F1F2E",
          borderRight: `1px solid ${isDark ? "#2C2C2E" : "#2C2C3E"}`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
          <MessageCircle size={20} color="#FFF" />
        </div>

        <NavIcon
          icon={MessageCircle}
          active={activePage === "chats"}
          onClick={() => navigate("/chats")}
          label="Sohbet"
          isDark={isDark}
        />
        <NavIcon
          icon={Users}
          active={activePage === "contacts"}
          onClick={() => navigate("/contacts")}
          label="Kişiler"
          isDark={isDark}
        />

        <div className="flex-1" />

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{
            backgroundColor: isDark ? "#2C2C2E" : "#2C2C3E",
            color: "#FFFFFF",
          }}
          title={isDark ? "Açık Mod" : "Koyu Mod"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 md:hidden z-20 border-t"
        style={{
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderColor: isDark ? "#2C2C2E" : "#E5E5E5",
        }}
      >
        <button
          onClick={() => navigate("/chats")}
          className="flex flex-col items-center gap-1 px-4 py-2"
          style={{
            color:
              activePage === "chats"
                ? "#0062FF"
                : isDark
                  ? "#8E8E93"
                  : "#6B6B6B",
          }}
        >
          <MessageCircle size={24} />
          <span className="text-xs font-poppins">Sohbetler</span>
        </button>
        <button
          onClick={() => navigate("/contacts")}
          className="flex flex-col items-center gap-1 px-4 py-2"
          style={{
            color:
              activePage === "contacts"
                ? "#0062FF"
                : isDark
                  ? "#8E8E93"
                  : "#6B6B6B",
          }}
        >
          <Users size={24} />
          <span className="text-xs font-poppins">Kişiler</span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 px-4 py-2"
          style={{ color: isDark ? "#8E8E93" : "#6B6B6B" }}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
          <span className="text-xs font-poppins">
            {isDark ? "Açık" : "Koyu"}
          </span>
        </button>
      </div>
    </>
  );
}

function NavIcon({ icon: Icon, active, onClick, label, isDark }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
      style={{
        backgroundColor: active ? "#0062FF" : isDark ? "#2C2C2E" : "#2C2C3E",
        color: active ? "#FFFFFF" : "#8E8E93",
      }}
      title={label}
    >
      <Icon size={22} />
    </button>
  );
}
