import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, AlertCircle, Users } from 'lucide-react';
import ChatContainer from './ChatContainer';
import { useChat } from '@/lib/hooks/useChat'
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '@/amplify/data/resource';

type LoanRequestModel = Schema['LoanRequest']['type'];

interface LoanChatProps {
  loanRequest: LoanRequestModel;
  className?: string;
}

function LoanChat({ loanRequest, className }: LoanChatProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get current user
  useEffect(() => {
    getCurrentUser().then(user => {
      setCurrentUserId(user.userId);
    }).catch(console.error);
  }, []);

  // Use the chat hook 
  const {
    chat,
    messages,
    chatLoading,
    sendMessage,
    sending,
    error
  } = useChat({
    loanRequestId: loanRequest.id,
    enabled: true
  });

  // Loading state
  if (chatLoading || !currentUserId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat
            <Badge variant="secondary">Loading</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat
            <Badge variant="destructive">Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load chat. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No chat available yet
  if (!chat) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat
            <Badge variant="secondary">Initializing</Badge>
          </CardTitle>
          <CardDescription>
            Setting up chat for loan coordination...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Chat is being set up. This may take a moment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Get participant info
  const isLender = currentUserId === loanRequest.lenderId;
  const otherParticipant = isLender ? 
    { username: chat.borrowerUsername, email: chat.borrowerEmail } :
    { username: chat.lenderUsername, email: chat.lenderEmail };

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Chatting with {otherParticipant.username || otherParticipant.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 pl-3 pr-3 pb-0"> {/* Fixed height for chat */}
          <ChatContainer
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={sendMessage}
            isLoading={sending}
            placeholder="Type a message to coordinate the book handoff..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default LoanChat;