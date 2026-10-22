// hooks/useSSE.js
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not open an authenticated stream when logged out.
    if (!user) return;

    const source = new EventSource(url, { withCredentials: true });

    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
      }
    };

    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    return () => source.close();
  }, [url, user, onMessage]);
}
