import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: Date;
  isRead?: boolean;
  className?: string;
}

function MessageBubble({
  content,
  isOwn,
  timestamp,
  isRead = false,
  className
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div
      className={cn(
        "relative max-w-xs px-3 py-2 rounded-2xl break-words",
        isOwn
          ? "bg-primary text-primary-foreground ml-auto"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <div className="text-sm leading-relaxed">
        {content}
      </div>
      
      <div className={cn(
        "flex items-center gap-1 mt-1 text-xs opacity-70",
        isOwn ? "justify-end" : "justify-start"
      )}>
        <span>{formatTime(timestamp)}</span>
        
        {isOwn && (
          <div className="flex items-center">
            {isRead ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;