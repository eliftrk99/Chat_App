"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Send,
  Clock,
  Check,
  CheckCheck,
  Users,
} from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";
import { useWebNotifications } from "@/utils/useWebNotifications";

export default function ChatPage({ params }) {
  const id = params?.id;
  const { isDark } = useTheme();
  const { sendNotification } = useWebNotifications();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) loadChat();
  }, [id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = () => {
    if (typeof window === "undefined") return;
    const chatsData = localStorage.getItem("chats");
    if (chatsData) {
      const chat = JSON.parse(chatsData).find((c) => c.id === id);
      if (chat) setChatInfo(chat);
    }
    const msgs = localStorage.getItem(`messages_${id}`);
    if (msgs) setMessages(JSON.parse(msgs));
  };

  const saveMessages = (newMessages) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`messages_${id}`, JSON.stringify(newMessages));
    const chatsData = localStorage.getItem("chats");
    if (chatsData) {
      const chats = JSON.parse(chatsData);
      const idx = chats.findIndex((c) => c.id === id);
      if (idx !== -1 && newMessages.length > 0) {
        const last = newMessages[newMessages.length - 1];
        chats[idx].message = last.text;
        chats[idx].time = last.timestamp;
        localStorage.setItem("chats", JSON.stringify(chats));
      }
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      type: "outgoing",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "queued",
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    setMessageText("");

    // Simulate incoming reply notification after 2s (demo)
    if (document.hidden) {
      sendNotification(`${chatInfo?.name || "Mesaj"}`, newMsg.text, {
        chatId: id,
      });
    }
  };

  const getStatusIcon = (status) => {
    if (status === "queued")
      return <Clock size={13} color={isDark ? "#8E8E93" : "#B4B4B4"} />;
    if (status === "delivered")
      return <Check size={13} color={isDark ? "#8E8E93" : "#B4B4B4"} />;
    if (status === "read") return <CheckCheck size={13} color="#09C26A" />;
    return null;
  };

  const bg = isDark ? "#121212" : "#FFFFFF";
  const headerBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const border = isDark ? "#2C2C2E" : "#E5E5E5";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#8E8E93" : "#9B9B9B";
  const inputBg = isDark ? "#2C2C2E" : "#F5F5F5";
  const incomingBubble = isDark ? "#2C2C2E" : "#F1F1F1";
  const infoBarBg = isDark ? "#2C2C2E" : "#F1F1F1";

  if (!chatInfo) return null;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "16px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textPrimary,
              display: "flex",
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: chatInfo.avatarBg || "#E8E4FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {chatInfo.isGroup ? (
              <Users size={20} color="#0062FF" />
            ) : (
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#0062FF",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {chatInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: textPrimary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {chatInfo.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: textSecondary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {chatInfo.isGroup
                ? `${chatInfo.memberCount || 0} üye`
                : "Çevrimdışı"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", backgroundColor: bg }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                backgroundColor: infoBarBg,
                borderRadius: 999,
                padding: "6px 14px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: textSecondary,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {chatInfo.isGroup
                  ? "Grup mesajları yerel olarak saklanır"
                  : "Mesajlar yerel olarak saklanır"}
              </span>
            </div>
          </div>

          {messages.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 60,
              }}
            >
              <p
                style={{
                  color: textSecondary,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Henüz mesaj yok. Sohbeti başlatın!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.type === "outgoing" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{ maxWidth: "75%" }}>
                    <div
                      style={{
                        backgroundColor:
                          msg.type === "outgoing" ? "#0062FF" : incomingBubble,
                        borderRadius: 18,
                        borderBottomRightRadius:
                          msg.type === "outgoing" ? 4 : 18,
                        borderBottomLeftRadius:
                          msg.type === "outgoing" ? 18 : 4,
                        padding: "10px 16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.5,
                          color:
                            msg.type === "outgoing" ? "#FFFFFF" : textPrimary,
                          fontFamily: "Inter, sans-serif",
                          margin: 0,
                        }}
                      >
                        {msg.text}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                        justifyContent:
                          msg.type === "outgoing" ? "flex-end" : "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: textSecondary,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {msg.timestamp}
                      </span>
                      {msg.type === "outgoing" && getStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div
        style={{
          backgroundColor: headerBg,
          borderTop: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: inputBg,
              borderRadius: 24,
              border: `1px solid ${border}`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
              paddingRight: 8,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <input
              type="text"
              placeholder="Mesaj yaz..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: textPrimary,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: messageText.trim()
                ? "#0062FF"
                : isDark
                  ? "#2C2C2E"
                  : "#E5E5E5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: messageText.trim() ? "pointer" : "default",
              color: messageText.trim() ? "#FFF" : textSecondary,
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
