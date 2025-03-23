import { pyServer } from "@/axios/axios.config";
import { useState, useCallback } from "react";

export interface ChatMessage {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    isYtEnabled?: boolean; // Optional field for YouTube toggle state
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
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

    const [isThinking, setIsThinking] = useState(false); // Thinking state

    const getActiveChat = useCallback(() => {
        if (!activeChatId) return null;
        return chatSessions.find(session => session.id === activeChatId) || null;
    }, [activeChatId, chatSessions]);

    const sendMessage = useCallback(async (content: string, isYtEnabled: boolean) => {
        if (!content.trim()) return;

        const chatid = activeChatId || Date.now().toString();

        // Add user message instantly
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            content,
            sender: "user",
            timestamp: new Date(),
            isYtEnabled,
        };

        // Update chat sessions with the user's message
        if (!activeChatId) {
            const newSession: ChatSession = {
                id: chatid,
                title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                lastMessage: content,
                timestamp: new Date(),
                messages: [newMessage],
            };

            setChatSessions(prev => [newSession, ...prev]);
            setActiveChatId(chatid);
        } else {
            setChatSessions(prev =>
                prev.map(session => {
                    if (session.id === activeChatId) {
                        return {
                            ...session,
                            lastMessage: content,
                            timestamp: new Date(),
                            messages: [...session.messages, newMessage],
                        };
                    }
                    return session;
                })
            );
        }

        setInputValue(""); // Clear input
        setIsThinking(true); // Show thinking state

        try {
            let resp;
            if (!isYtEnabled) {
                resp = await pyServer.post("/chatllm/", {
                    question: content.trim(),
                    session_id: chatid,
                });
            } else {
                resp = await pyServer.post("/youtubesummerization/", {
                    link: content.trim(),
                });
            }

            // Add AI response to the chat
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: resp.data.result,
                sender: "ai",
                timestamp: new Date(),
            };

            setChatSessions(prev =>
                prev.map(session => {
                    if (session.id === chatid) {
                        return {
                            ...session,
                            lastMessage: aiResponse.content,
                            timestamp: new Date(),
                            messages: [...session.messages, aiResponse],
                        };
                    }
                    return session;
                })
            );
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally, add an error message to the chat
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: "Failed to get a response. Please try again.",
                sender: "ai",
                timestamp: new Date(),
            };

            setChatSessions(prev =>
                prev.map(session => {
                    if (session.id === chatid) {
                        return {
                            ...session,
                            lastMessage: errorMessage.content,
                            timestamp: new Date(),
                            messages: [...session.messages, errorMessage],
                        };
                    }
                    return session;
                })
            );
        } finally {
            setIsThinking(false); // Hide thinking state
        }
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
        isThinking, // Expose thinking state
    };
};
