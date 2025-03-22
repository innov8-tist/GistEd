
import React, { useRef, useEffect } from "react";
import { Send, Plus, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage, ChatSession } from "@/hooks/useChatState";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  activeChatId,
  onSelectSession,
  onNewChat,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 h-[calc(100vh-10rem)] overflow-y-auto animate-fade-in">
      <button 
        onClick={onNewChat}
        className="w-full mb-4 flex items-center justify-center space-x-2 bg-white py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Plus size={16} />
        <span>New Chat</span>
      </button>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Chats</h3>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeChatId === session.id ? "bg-blue-50 border-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium text-gray-900 truncate">{session.title}</div>
            <div className="text-sm text-gray-500 truncate">{session.lastMessage}</div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(session.timestamp, { addSuffix: true })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface ChatMessageListProps {
  messages: ChatMessage[] | undefined;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
        <h3 className="text-2xl font-medium text-gray-500 mb-2">EduSpark AI Assistant</h3>
        <p className="text-gray-400 max-w-md text-center">
          Ask me anything about your studies, research papers, or learning materials.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-16rem)]">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-bubble ${
            message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
          } ${message.sender === "user" ? "ml-auto" : "mr-auto"} mb-3`}
        >
          {message.content}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-4 animate-slide-up">
      <div className="relative flex items-center max-w-3xl mx-auto">
        <button className="absolute left-3 text-gray-400 hover:text-gray-600 transition-colors">
          <Paperclip size={18} />
        </button>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="chat-input pl-10 pr-12"
        />
        
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`absolute right-3 p-1.5 rounded-full ${
            value.trim() ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
          } transition-colors`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
