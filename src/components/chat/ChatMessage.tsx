import MessageBubble from './MessageBubble';
import { cn } from '@/lib/utils';
import type { Schema } from '@/amplify/data/resource';

type MessageModel = Schema['Message']['type'];

interface ChatMessageProps {
  message: MessageModel;
  isOwn: boolean;
}

function ChatMessage({ message, isOwn }: ChatMessageProps) {
  if (message.messageType === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {message.senderUsername.charAt(0).toUpperCase()}
        </div>
      )}
      
      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        {!isOwn && (
          <div className="text-xs text-muted-foreground mb-1">
            {message.senderUsername}
          </div>
        )}
        
        <MessageBubble
          content={message.content}
          isOwn={isOwn}
          timestamp={new Date(message.createdAt || new Date().toISOString())}
          isRead={message.isRead || false}
        />
      </div>
      
      {isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
          {message.senderUsername.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;