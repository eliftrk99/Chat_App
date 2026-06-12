"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";

export default function CreateGroupPage() {
  const { isDark } = useTheme();
  const [groupName, setGroupName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#121212" : "#FFFFFF";
  const headerBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const border = isDark ? "#2C2C2E" : "#E5E5E5";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#8E8E93" : "#6B6B6B";
  const inputBg = isDark ? "#2C2C2E" : "#F5F5F5";
  const cardBg = isDark ? "#1E1E1E" : "#F9FAFC";

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");

      const data = await response.json();
      const transformedContacts = data.contacts.map((contact) => ({
        id: contact.id.toString(),
        name: contact.name,
        phoneNumber: contact.phone_number,
        avatar: contact.avatar_url,
        avatarBg: contact.avatar_bg,
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      if (typeof window !== "undefined") {
        const contactsData = localStorage.getItem("contacts");
        if (contactsData) {
          setContacts(JSON.parse(contactsData));
        }
      }
    }
  };

  const toggleMember = (contact) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m.id === contact.id);
      if (exists) {
        return prev.filter((m) => m.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Lütfen grup adı girin");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("Lütfen en az bir üye seçin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName.trim(),
          members: selectedMembers.map((m) => ({ phoneNumber: m.phoneNumber })),
          createdBy: "+1234567890",
          avatarBg: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to create group");

      const data = await response.json();

      if (typeof window !== "undefined") {
        const chatsData = localStorage.getItem("chats");
        const chats = chatsData ? JSON.parse(chatsData) : [];

        const newChat = {
          id: `group_${data.group.id}`,
          groupId: data.group.id,
          isGroup: true,
          name: data.group.name,
          avatarBg: data.group.avatar_bg,
          message: "",
          time: "",
          unread: 0,
          memberCount: data.group.member_count,
        };

        chats.unshift(newChat);
        localStorage.setItem("chats", JSON.stringify(chats));

        window.location.href = "/chats";
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Grup oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
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
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
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
          <h1
            style={{
              flex: 1,
              fontSize: 22,
              fontWeight: 600,
              color: textPrimary,
              fontFamily: "Poppins, sans-serif",
              margin: 0,
            }}
          >
            Yeni Grup
          </h1>
          <button
            onClick={handleCreateGroup}
            disabled={
              loading || !groupName.trim() || selectedMembers.length === 0
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#0062FF",
              fontWeight: 600,
              fontSize: 16,
              fontFamily: "Poppins, sans-serif",
              opacity:
                loading || !groupName.trim() || selectedMembers.length === 0
                  ? 0.5
                  : 1,
            }}
          >
            Oluştur
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        {/* Group Name */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: textSecondary,
              marginBottom: 8,
              textTransform: "uppercase",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Grup Adı
          </label>
          <input
            type="text"
            placeholder="Grup adını girin"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
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

        {/* Members Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textSecondary,
              textTransform: "uppercase",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Üyeler
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#0062FF",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {selectedMembers.length} seçildi
          </span>
        </div>

        {/* Contacts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {contacts.map((contact) => {
            const isSelected = selectedMembers.find((m) => m.id === contact.id);
            return (
              <button
                key={contact.id}
                onClick={() => toggleMember(contact)}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  border: isSelected
                    ? "2px solid #0062FF"
                    : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
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
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    border: `2px solid ${isSelected ? "#0062FF" : "#B4B4B4"}`,
                    backgroundColor: isSelected ? "#0062FF" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && <Check size={16} color="#FFFFFF" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
