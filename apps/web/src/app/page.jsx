"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/chats";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Yönlendiriliyor...</p>
    </div>
  );
}
