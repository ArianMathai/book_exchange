import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { client } from '@/lib/amplifyClient';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import type { Schema } from '@/amplify/data/resource';

type ChatModel = Schema['Chat']['type'];
type MessageModel = Schema['Message']['type'];

interface UseChatProps {
  loanRequestId: string;
  enabled?: boolean;
}

interface UseChatReturn {
  chat: ChatModel | null | undefined;
  messages: MessageModel[];
  chatLoading: boolean;
  messagesLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  sending: boolean;
  error: Error | null;
}

export function useChat({ loanRequestId, enabled = true }: UseChatProps): UseChatReturn {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch chat data
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', loanRequestId],
    queryFn: async () => {
      if (!loanRequestId) throw new Error('No loan request ID provided');
      
      // First, try to get chat by loanRequestId
      const chatResult = await client.models.Chat.list({
        filter: { loanRequestId: { eq: loanRequestId } }
      });
      
      if (chatResult.data && chatResult.data.length > 0) {
        return chatResult.data[0];
      }
      
      return null; // Chat doesn't exist yet
    },
    enabled: !!loanRequestId && enabled
  });

  // Set up initial fetch and real-time subscriptions for messages when chat is available
  useEffect(() => {
    if (!chat?.id) return;

    let createSubscription: { unsubscribe(): void } | undefined;
    let updateSubscription: { unsubscribe(): void } | undefined;
    let isCleanedUp = false; // Race condition prevention

    const setupMessaging = async () => {
      if (isCleanedUp) return; // Prevent setup after cleanup

      try {
        setMessagesLoading(true);

        // 1. Initial fetch of existing messages
        const result = await client.models.Message.list({
          filter: { chatId: { eq: chat.id } }
        });

        if (isCleanedUp) return; // Check again after async operation

        if (result.data) {
          // Sort by creation date, oldest first for proper chat order
          const sortedMessages = [...result.data].sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          setMessages(sortedMessages);
        }

        setMessagesLoading(false);

        // 2. Subscribe to new messages being created
        createSubscription = client.models.Message.onCreate().subscribe({
          next: (newMessage) => {
            if (isCleanedUp) return;
            
            // Only add if it's for this chat
            if (newMessage.chatId === chat.id) {
              setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const exists = prev.some(msg => msg.id === newMessage.id);
                if (!exists) {
                  // Optimized insertion: new messages are typically newest, insert at end
                  const newMessageTime = newMessage.createdAt ? new Date(newMessage.createdAt).getTime() : Date.now();
                  const lastMessageTime = prev.length > 0 && prev[prev.length - 1].createdAt 
                    ? new Date(prev[prev.length - 1].createdAt!).getTime() 
                    : 0;
                  
                  if (newMessageTime >= lastMessageTime) {
                    // Common case: new message is newest, just append
                    return [...prev, newMessage];
                  } else {
                    // Edge case: out-of-order message, need to sort
                    const newMessages = [...prev, newMessage];
                    return newMessages.sort((a, b) => {
                      if (!a.createdAt || !b.createdAt) return 0;
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    });
                  }
                }
                return prev;
              });
            }
          },
          error: (e) => {
            if (isCleanedUp) return;
            console.error('Create subscription error:', e);
            setError(e instanceof Error ? e : new Error('Create subscription failed'));
          }
        });

        // 3. Subscribe to message updates (for read status, etc.)
        updateSubscription = client.models.Message.onUpdate().subscribe({
          next: (updatedMessage) => {
            if (isCleanedUp) return;
            
            // Only update if it's for this chat
            if (updatedMessage.chatId === chat.id) {
              setMessages(prev => prev.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              ));
            }
          },
          error: (e) => {
            if (isCleanedUp) return;
            console.error('Update subscription error:', e);
          }
        });

        setError(null);
      } catch (e) {
        if (isCleanedUp) return;
        console.error('Failed to setup messaging:', e);
        setError(e instanceof Error ? e : new Error('Failed to setup messaging'));
        setMessagesLoading(false);
      }
    };

    setupMessaging();

    return () => {
      isCleanedUp = true; // Set cleanup flag first
      if (createSubscription) {
        createSubscription.unsubscribe();
      }
      if (updateSubscription) {
        updateSubscription.unsubscribe();
      }
      setMessagesLoading(false);
    };
  }, [chat?.id]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chat) throw new Error('Chat not available');
      
      // Get current user info
      const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      
      if (!user || !userAttributes.email) {
        throw new Error('User authentication required');
      }

      // Get username from public profile or fall back to email
      const userProfile = await client.models.PublicProfile.list({
        filter: { userId: { eq: user.userId } }
      });
      
      const username = userProfile.data?.[0]?.username || userAttributes.email;

      // Create the message
      const messageData = {
        chatId: chat.id,
        content,
        senderId: user.userId,
        senderEmail: userAttributes.email,
        senderUsername: username,
        messageType: 'text' as const,
        isRead: false,
        // Include both lender and borrower IDs for authorization
        lenderId: chat.lenderId,
        borrowerId: chat.borrowerId
      };

      const result = await client.models.Message.create(messageData);
      
      if (!result.data) {
        throw new Error('Failed to create message');
      }

      // Update chat's last message info
      await client.models.Chat.update({
        id: chat.id,
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: content.substring(0, 100) // Truncate preview
      });

      return result.data;
    },
    onSuccess: () => {
      // Messages will be updated via subscription, no need to invalidate
      // Only invalidate chat if we need to update lastMessageAt info
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      setError(error instanceof Error ? error : new Error('Failed to send message'));
    }
  });

  const sendMessage = useCallback(async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
  }, [sendMessageMutation]);

  return {
    chat,
    messages,
    chatLoading,
    messagesLoading,
    sendMessage,
    sending: sendMessageMutation.isPending,
    error
  };
}