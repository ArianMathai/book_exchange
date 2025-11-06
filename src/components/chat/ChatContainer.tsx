import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Schema } from '@/amplify/data/resource';

type MessageModel = Schema['Message']['type'];

interface ChatContainerProps {
  messages: MessageModel[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

function ChatContainer({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
  className,
  placeholder = "Type a message..."
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className={cn("flex flex-col h-full py-0 gap-0", className)}>
      {/* Messages area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-2">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder={placeholder}
        />
      </div>
    </Card>
  );
}

export default ChatContainer;