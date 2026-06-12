"use client";

import { useEffect, useState } from "react";

export function useWebNotifications() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window))
      return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Notification permission error:", error);
      return false;
    }
  };

  const sendNotification = (title, body, options = {}) => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    try {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: options.tag || "offline-messenger",
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        if (options.chatId) {
          window.location.href = `/chat/${options.chatId}`;
        }
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return { permission, requestPermission, sendNotification };
}
