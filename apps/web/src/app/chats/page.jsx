"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Search, Users, Bell, BellOff } from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";
import { useWebNotifications } from "@/utils/useWebNotifications";
import Sidebar from "@/components/Sidebar";

export default function ChatsPage() {
  const { isDark } = useTheme();
  const { permission, requestPermission } = useWebNotifications();
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifBanner, setShowNotifBanner] = useState(false);

  useEffect(() => {
    loadChats();
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      setShowNotifBanner(true);
    }
  }, []);

  const loadChats = () => {
    if (typeof window !== "undefined") {
      const chatsData = localStorage.getItem("chats");
      if (chatsData) {
        setChats(JSON.parse(chatsData));
      }
    }
  };

  const handleRequestNotif = async () => {
    await requestPermission();
    setShowNotifBanner(false);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const bg = isDark ? "#121212" : "#FFFFFF";
  const headerBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const borderColor = isDark ? "#2C2C2E" : "#E5E5E5";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#8E8E93" : "#6B6B6B";
  const inputBg = isDark ? "#2C2C2E" : "#F5F5F5";
  const cardBg = isDark ? "#1E1E1E" : "#F9FAFC";
  const cardHover = isDark ? "#2C2C2E" : "#F0F0F0";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
      <Sidebar activePage="chats" />

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:ml-20 flex items-center justify-between">
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: textPrimary,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Sohbetler
          </h1>
          <div
            style={{
              color: permission === "granted" ? "#4CAF50" : textSecondary,
            }}
          >
            {permission === "granted" ? (
              <Bell size={20} />
            ) : (
              <BellOff size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {showNotifBanner && (
        <div
          style={{
            backgroundColor: "#0062FF",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="md:ml-20"
        >
          <span
            style={{
              color: "#FFF",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            🔔 Mesaj bildirimlerine izin ver
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowNotifBanner(false)}
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Sonra
            </button>
            <button
              onClick={handleRequestNotif}
              style={{
                backgroundColor: "#FFF",
                color: "#0062FF",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                padding: "4px 12px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              İzin Ver
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:ml-20 pb-24 md:pb-6">
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: textSecondary,
            }}
            size={20}
          />
          <input
            type="text"
            placeholder="Sohbet ara..."
            style={{
              width: "100%",
              paddingLeft: 48,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              backgroundColor: inputBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              color: textPrimary,
              outline: "none",
              fontFamily: "Poppins, sans-serif",
              boxSizing: "border-box",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredChats.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 80,
              paddingBottom: 80,
            }}
          >
            <MessageCircle
              size={64}
              color={isDark ? "#3C3C3E" : "#D1D1D6"}
              style={{ marginBottom: 16 }}
            />
            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: textPrimary,
                marginBottom: 8,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Henüz Sohbet Yok
            </h3>
            <p
              style={{
                color: textSecondary,
                textAlign: "center",
                maxWidth: 300,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Kişilerden birini seçerek yeni bir sohbet başlatın
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() =>
                  typeof window !== "undefined" &&
                  (window.location.href = `/chat/${chat.id}`)
                }
                style={{
                  width: "100%",
                  backgroundColor: cardBg,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  border: "none",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = cardHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = cardBg)
                }
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: chat.avatarBg || "#E8E4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {chat.isGroup ? (
                    <Users size={24} color="#0062FF" />
                  ) : (
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#0062FF",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: textPrimary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {chat.name}
                    </span>
                    {chat.isGroup && (
                      <span
                        style={{
                          fontSize: 13,
                          color: textSecondary,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        ({chat.memberCount || 0})
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: textSecondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {chat.message ||
                      (chat.isGroup ? "Grup oluşturuldu" : "Henüz mesaj yok")}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: textSecondary,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {chat.time}
                  </span>
                  {chat.unread > 0 && (
                    <div
                      style={{
                        backgroundColor: "#E34F54",
                        color: "#FFF",
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                      }}
                    >
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
