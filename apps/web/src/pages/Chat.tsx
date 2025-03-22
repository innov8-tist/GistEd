
import React from "react";
import NavigationBar from "@/components/NavigationBar";
import { ChatHistory, ChatMessageList, ChatInput } from "@/components/ChatInterface";
import { useChatState } from "@/hooks/useChatState";

const Chat = () => {
  const {
    inputValue,
    setInputValue,
    chatSessions,
    activeChatId,
    getActiveChat,
    sendMessage,
    startNewChat,
    selectChatSession,
  } = useChatState();

  const activeChat = getActiveChat();

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <NavigationBar />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          <div className="w-1/4">
            <ChatHistory
              sessions={chatSessions}
              activeChatId={activeChatId}
              onSelectSession={selectChatSession}
              onNewChat={startNewChat}
            />
          </div>
          
          <div className="w-3/4 flex flex-col glass rounded-lg overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ChatMessageList messages={activeChat?.messages} />
            </div>
            
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
