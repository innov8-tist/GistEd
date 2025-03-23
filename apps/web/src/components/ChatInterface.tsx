import React, { useState, useEffect, useRef } from "react";
import { Paperclip, Youtube, Mic, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown"

// Define types for ChatMessage and ChatSession
interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Props for ChatHistoryimport ReactMarkdown from 'react-markdown'

interface ChatHistoryProps {
    sessions: ChatSession[];
    activeChatId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
}

// ChatHistory Component
export const ChatHistory: React.FC<ChatHistoryProps> = ({
    sessions,
    activeChatId,
    onSelectSession,
    onNewChat,
}) => {
  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 h-[calc(100vh-10rem)] overflow-y-auto">
      <button
        onClick={onNewChat}
        className="w-full mb-4 flex items-center justify-center space-x-2 bg-white py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <Plus size={16} />
        <span>New Chat</span>
      </button>

      <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Chats</h3>
      <div className="space-y-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeChatId === session.id
                ? "bg-blue-50 border-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium text-gray-900 truncate">
              {session.title}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {session.lastMessage}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(session.timestamp, { addSuffix: true })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Props for ChatMessageList

interface ChatMessageListProps {
  messages: ChatMessage[] | undefined;
  isThinking: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isThinking,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div className="flex flex-col flex-grow h-[calc(100vh-16rem)] overflow-auto px-4 py-6 w-full">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${
              message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
            } ${message.sender === "user" ? "ml-auto" : "mr-auto"} mb-3 max-w-[80%] break-words`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-medium text-gray-500 mb-2">GistED AI Assistant</h3>
          <p className="text-gray-400 max-w-md text-center">
            Ask me anything about your studies, research papers, or learning materials.
          </p>
        </div>
      )}

      {isThinking && (
        <div className="chat-bubble chat-bubble-ai mr-auto mb-3 max-w-[80%] break-words">
          <div className="flex items-center">
            <div className="animate-pulse">Thinking...</div>
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

// Props for ChatInput
interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (isYtEnabled: boolean) => void; // Update onSend to accept YouTube state
}

// ChatInput Component
export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false; // Stop after a pause
    recognitionInstance.interimResults = false; // Only final results
    recognitionInstance.lang = "en-US"; // Set language

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      console.log("Speech recognition result:", event.results);
      const transcript = event.results[0][0].transcript;
      onChange(transcript); // Update the chat input with the recognized text
      setIsListening(false); // Stop listening
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended.");
      setIsListening(false); // Stop listening when the API stops
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false); // Stop listening on error

      // Display a user-friendly error message
      alert(`Speech recognition failed: ${event.error}. Please check your internet connection and try again.`);
    };

    setRecognition(recognitionInstance);
  }, [onChange]);

  const handleMicClick = () => {
    if (recognition) {
      if (!isListening) {
        recognition.start(); // Start listening
        setIsListening(true);
      } else {
        recognition.stop(); // Stop listening
        setIsListening(false);
      }
    }
  };

    const [isYtEnabled, setIsYtEnabled] = useState(false); // State for YouTube toggle

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend(isYtEnabled); // Pass the YouTube toggle state when sending
        }
    };

    return (
        <div className="bg-white border-t border-gray-100 p-4 w-full">
            <div className="relative flex items-center w-full mx-auto">
                <button className="absolute left-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <Paperclip size={18} />
                </button>

                {/* YouTube Toggle Button */}
                <button
                    onClick={() => setIsYtEnabled(!isYtEnabled)} // Toggle YouTube state
                    className={`absolute left-10 transition-colors ${isYtEnabled ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <Youtube size={18} />
                </button>

                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    rows={1}
                    className="chat-input pl-16 pr-12 resize-none overflow-hidden w-full"
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                />

                <button
                    onClick={() => handleMicClick(isYtEnabled)} // Pass the YouTube toggle state when sending
                    disabled={!recognition}
                    className={`absolute right-3 p-1.5 rounded-full ${isListening
              ? "bg-red-500 text-white"
              : value.trim()
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-400"
                        } transition-colors`}
                >
                    <Mic size={18} />
                </button>
            </div>
        </div>
    );
};

export const ChatContainer: React.FC = () => {
    return (
        <div className="flex w-full h-screen">
            <div className="w-1/4">
                <ChatHistory sessions={[]} activeChatId={null} onSelectSession={() => { }} onNewChat={() => { }} />
            </div>
            <div className="flex flex-col w-3/4">
                <ChatMessageList messages={[]} />
                <ChatInput value="" onChange={() => { }} onSend={() => { }} />
            </div>
        </div>
    );
};
