// src/hooks/useSocketPing.ts
import { useEffect, useRef } from "react";

export const useSocketPing = (
  socket: WebSocket | null,
  intervalMs: number = 5000,
  payload: Record<string, unknown> = { type: "ping" }
) => {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const sendPing = () => {
      try {
        socket.send(JSON.stringify(payload));
      } catch (err) {
        console.error("Erreur lors de l'envoi du ping :", err);
      }
    };

    intervalRef.current = window.setInterval(sendPing, intervalMs);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [socket, intervalMs, JSON.stringify(payload)]);
};
