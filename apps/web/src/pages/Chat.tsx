
import NavigationBar from "@/components/NavigationBar";
import { ChatHistory, ChatMessageList, ChatInput } from "@/components/ChatInterface";
import { useChatState } from "@/hooks/useChatState";
import LanguageSelector from "@/components/LanguageSelector";

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

  const handleSendMessage = (isYtEnabled: boolean) => {
    if (inputValue.trim()) {
      sendMessage(inputValue, isYtEnabled); // Pass the YouTube toggle state
    }
  };
  
  return (
    <div className="min-h-screen bg-white p-0">
      <NavigationBar />
      
      <div className="max-w-8xl mx-auto">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          <div className="w-1/4">
            <ChatHistory
              sessions={chatSessions}
              activeChatId={activeChatId}
              onSelectSession={selectChatSession}
              onNewChat={startNewChat}
            />
          </div>
          
          <div className="w-3/4 flex flex-col glass rounded-lg overflow-hidden relative">
            {/* Language selector positioned in the top-right corner */}
            <div className="absolute top-3 right-3 z-10">
              <LanguageSelector onChange={(lang) => console.log(`Language changed to: ${lang}`)} />
            </div>
            
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
