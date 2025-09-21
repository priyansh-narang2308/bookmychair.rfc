/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    const s = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      secure: true,
      auth: { token },
      query: { userId: user.id },
    });
    setSocket(s);
    s.on("notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });
    s.on("connect_error", (err) => {
      console.error("Socket.IO error:", err.message);
      if (err.message === "Session ID unknown") {
        s.disconnect();
        setTimeout(() => s.connect(), 2000);
      }
    });
    return () => {
      s.disconnect();
    };
  }, [user, token]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
