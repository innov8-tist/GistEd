
import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export const useChatState = () => {
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Research Paper Help",
      lastMessage: "Can you help me with my research paper?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messages: [
        {
          id: "msg1",
          content: "Can you help me with my research paper?",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: "msg2",
          content: "I'd be happy to help with your research paper. What topic are you working on?",
          sender: "ai",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000),
        },
      ],
    },
    {
      id: "2",
      title: "Math Problem Solving",
      lastMessage: "How do I solve quadratic equations?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messages: [
        {
          id: "msg3",
          content: "How do I solve quadratic equations?",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: "msg4",
          content: "To solve quadratic equations, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a where ax² + bx + c = 0",
          sender: "ai",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 30000),
        },
      ],
    },
  ]);

  const getActiveChat = useCallback(() => {
    if (!activeChatId) return null;
    return chatSessions.find(session => session.id === activeChatId) || null;
  }, [activeChatId, chatSessions]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "This is a simulated AI response to your message: " + content,
      sender: "ai",
      timestamp: new Date(Date.now() + 1000),
    };

    if (!activeChatId) {
      // Create new chat session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        lastMessage: content,
        timestamp: new Date(),
        messages: [newMessage, aiResponse],
      };

      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSession.id);
    } else {
      // Update existing chat session
      setChatSessions(prev => 
        prev.map(session => {
          if (session.id === activeChatId) {
            return {
              ...session,
              lastMessage: content,
              timestamp: new Date(),
              messages: [...session.messages, newMessage, aiResponse],
            };
          }
          return session;
        })
      );
    }

    setInputValue("");
  }, [activeChatId, setInputValue]);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setInputValue("");
  }, []);

  const selectChatSession = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  return {
    inputValue,
    setInputValue,
    chatSessions,
    activeChatId,
    getActiveChat,
    sendMessage,
    startNewChat,
    selectChatSession,
  };
};
