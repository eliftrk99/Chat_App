"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UsersRound,
  MessageCircle,
  Search,
} from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";
import Sidebar from "@/components/Sidebar";

export default function ContactsPage() {
  const { isDark } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      const transformed = data.contacts.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        phoneNumber: c.phone_number,
        avatar: c.avatar_url,
        avatarBg: c.avatar_bg,
      }));
      setContacts(transformed);
      if (typeof window !== "undefined")
        localStorage.setItem("contacts", JSON.stringify(transformed));
    } catch (error) {
      console.error("Error loading contacts:", error);
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("contacts");
        if (data) setContacts(JSON.parse(data));
      }
    }
  };

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert("Lütfen isim ve telefon numarası girin");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newContactName.trim(),
          phoneNumber: newContactPhone.trim(),
          avatarBg: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        }),
      });
      if (!response.ok) throw new Error("Failed to add contact");
      await loadContacts();
      setShowAddModal(false);
      setNewContactName("");
      setNewContactPhone("");
    } catch (error) {
      console.error(error);
      alert("Kişi eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (contact) => {
    if (typeof window === "undefined") return;
    const chatsData = localStorage.getItem("chats");
    const chats = chatsData ? JSON.parse(chatsData) : [];
    let existing = chats.find((c) => c.contactId === contact.id);
    if (!existing) {
      existing = {
        id: `chat_${Date.now()}`,
        contactId: contact.id,
        name: contact.name,
        avatar: contact.avatar,
        avatarBg: contact.avatarBg,
        message: "",
        time: "",
        unread: 0,
        read: false,
      };
      chats.unshift(existing);
      localStorage.setItem("chats", JSON.stringify(chats));
    }
    window.location.href = `/chat/${existing.id}`;
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery),
  );

  const bg = isDark ? "#121212" : "#FFFFFF";
  const headerBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const border = isDark ? "#2C2C2E" : "#E5E5E5";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#8E8E93" : "#6B6B6B";
  const inputBg = isDark ? "#2C2C2E" : "#F5F5F5";
  const cardBg = isDark ? "#1E1E1E" : "#F9FAFC";
  const modalBg = isDark ? "#1E1E1E" : "#FFFFFF";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
      <Sidebar activePage="contacts" />

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: headerBg,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:ml-20">
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: textPrimary,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Kişiler
          </h1>
        </div>
      </div>

      {/* Content */}
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
            placeholder="Kişi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 48,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              backgroundColor: inputBg,
              border: `1px solid ${border}`,
              borderRadius: 12,
              color: textPrimary,
              outline: "none",
              fontFamily: "Poppins, sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Group Button */}
        <button
          onClick={() =>
            typeof window !== "undefined" &&
            (window.location.href = "/contacts/create-group")
          }
          style={{
            width: "100%",
            backgroundColor: "#0062FF",
            color: "#FFF",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 24,
            border: "none",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          <UsersRound size={20} /> Yeni Grup Oluştur
        </button>

        {/* Contacts */}
        {filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 80,
            }}
          >
            <Users
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
              Henüz Kişi Yok
            </h3>
            <p
              style={{
                color: textSecondary,
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Çevrimdışı mesajlaşma için kişi ekleyin
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((contact) => (
              <div
                key={contact.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: contact.avatarBg || "#E8E4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#0062FF",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: textPrimary,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {contact.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: textSecondary,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {contact.phoneNumber}
                  </div>
                </div>
                <button
                  onClick={() => handleStartChat(contact)}
                  style={{
                    backgroundColor: "#0062FF",
                    color: "#FFF",
                    border: "none",
                    borderRadius: 24,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: "fixed",
          bottom: 80,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0062FF",
          color: "#FFF",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,98,255,0.4)",
          cursor: "pointer",
          zIndex: 40,
        }}
        className="md:bottom-6"
      >
        <UserPlus size={24} />
      </button>

      {/* Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: modalBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              width: "100%",
              maxWidth: 480,
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: textPrimary,
                marginBottom: 20,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Yeni Kişi Ekle
            </h2>
            <input
              type="text"
              placeholder="İsim"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                backgroundColor: inputBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                color: textPrimary,
                outline: "none",
                marginBottom: 12,
                fontFamily: "Poppins, sans-serif",
                boxSizing: "border-box",
              }}
            />
            <input
              type="tel"
              placeholder="Telefon Numarası"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                backgroundColor: inputBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                color: textPrimary,
                outline: "none",
                marginBottom: 20,
                fontFamily: "Poppins, sans-serif",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewContactName("");
                  setNewContactPhone("");
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  backgroundColor: inputBg,
                  border: "none",
                  borderRadius: 12,
                  color: textPrimary,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddContact}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
                  backgroundColor: "#0062FF",
                  border: "none",
                  borderRadius: 12,
                  color: "#FFF",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {loading ? "Ekleniyor..." : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
