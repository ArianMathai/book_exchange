import type { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/approveLoanRequest';
import type { Schema } from '../../data/resource';

// Configure Amplify using the proper Gen 2 pattern
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

// Initialize Amplify client for server-side operations
const client = generateClient<Schema>();

// Simple input sanitization functions using built-in string methods
const sanitizeInput = (input: string, maxLength = 200): string => {
    if (!input) return '';
    
    // Remove HTML tags and dangerous characters
    let cleaned = input.replace(/<[^>]*>/g, ''); // Remove HTML tags
    cleaned = cleaned.replace(/[<>"'&]/g, ''); // Remove dangerous chars
    
    // Additional validation for suspicious patterns
    const suspiciousPatterns = [
        /javascript:/gi,
        /data:\s*text\/html/gi,
        /vbscript:/gi,
        /<script/gi,
        /on\w+\s*=/gi
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(cleaned));
    if (hasSuspiciousContent) {
        console.warn('Suspicious content detected and sanitized:', input);
        return cleaned.replace(/[;()[\]{}]/g, '');
    }
    
    return cleaned.trim().slice(0, maxLength);
};

const sanitizeEmail = (email: string): string => {
    const cleanEmail = sanitizeInput(email, 254);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        console.warn('Invalid email format detected:', email);
        return '';
    }
    return cleanEmail;
};

const sanitizeUsername = (username: string): string => {
    const cleanUsername = sanitizeInput(username, 50);
    const validUsername = cleanUsername.replace(/[^a-zA-Z0-9_-]/g, '');
    return validUsername;
};

const sanitizeContent = (content: string, maxLength = 500): string => {
    return sanitizeInput(content, maxLength);
};

type ApproveLoanRequestArgs = {
    loanRequestId: string;
    approvedDuration: number;
    userName: string;
};

type ApproveLoanRequestResult = {
    success: boolean;
    loanRequestId?: string;
    chatId?: string;
    message: string;
    error?: string;
};

export const handler: AppSyncResolverHandler<ApproveLoanRequestArgs, ApproveLoanRequestResult> = async (event) => {
    console.log('ApproveLoanRequest function called with:', JSON.stringify(event, null, 2));
    
    try {
        const { loanRequestId, approvedDuration, userName } = event.arguments;
        const identity = event.identity as AppSyncIdentityCognito;
        const currentUserId = identity?.sub;
        console.log("Required params: ", loanRequestId, currentUserId, userName, approvedDuration);

        // SECURITY: Validate required parameters
        if (!loanRequestId || !currentUserId || !userName || !approvedDuration) {
            return {
                success: false,
                message: 'Missing required parameters',
                error: 'MISSING_PARAMETERS'
            };
        }

        // SECURITY: Validate duration is reasonable (1-365 days)
        if (approvedDuration < 1 || approvedDuration > 365) {
            return {
                success: false,
                message: 'Invalid loan duration',
                error: 'INVALID_DURATION'
            };
        }

        // SECURITY: Fetch and validate loan request
        const loanRequestResult = await client.models.LoanRequest.get({ 
            id: loanRequestId 
        });

        if (!loanRequestResult.data) {
            return {
                success: false,
                message: 'Loan request not found',
                error: 'LOAN_REQUEST_NOT_FOUND'
            };
        }

        const loanRequest = loanRequestResult.data;

        // SECURITY: Validate current user is the lender
        if (loanRequest.lenderId !== currentUserId) {
            console.warn(`Unauthorized loan approval attempt: User ${currentUserId} tried to approve loan ${loanRequestId} owned by ${loanRequest.lenderId}`);
            return {
                success: false,
                message: 'Unauthorized: Only the lender can approve this loan request',
                error: 'UNAUTHORIZED'
            };
        }

        // SECURITY: Validate loan request status
        if (loanRequest.status !== 'pending') {
            return {
                success: false,
                message: `Cannot approve loan with status: ${loanRequest.status}`,
                error: 'INVALID_STATUS'
            };
        }

        // SECURITY: Fetch book information for notifications
        const bookResult = await client.models.Book.get({
            id: loanRequest.bookId
        });

        if (!bookResult.data) {
            return {
                success: false,
                message: 'Associated book not found',
                error: 'BOOK_NOT_FOUND'
            };
        }

        const book = bookResult.data;

        // Calculate due date
        const dueDate = new Date(Date.now() + approvedDuration * 24 * 60 * 60 * 1000);
        const currentTime = new Date();

        // STEP 1: Update loan request status to 'approved'
        await client.models.LoanRequest.update({
            id: loanRequestId,
            status: 'approved',
            approvedDuration: approvedDuration,
            respondedAt: currentTime.toISOString(),
            dueDate: dueDate.toISOString()
        });

        // STEP 2: Create LoanHandoff record
        const handoffResult = await client.models.LoanHandoff.create({
            loanRequestId: loanRequestId,
            requesterId: loanRequest.requesterId,
            lenderId: loanRequest.lenderId,
            lenderConfirmed: false,
            borrowerConfirmed: false
        });

        if (!handoffResult.data) {
            throw new Error('Failed to create handoff record');
        }

        // STEP 3: Update loan request status to 'meeting_arranged'
        await client.models.LoanRequest.update({
            id: loanRequestId,
            status: 'meeting_arranged'
        });

        // STEP 4: AUTOMATICALLY CREATE CHAT (Server-side only - cannot be bypassed)
        let chatId: string | undefined;

        try {
            // Check if chat already exists
            const existingChatsResult = await client.models.Chat.list({
                filter: { loanRequestId: { eq: loanRequestId } }
            });

            if (existingChatsResult.data && existingChatsResult.data.length > 0) {
                chatId = existingChatsResult.data[0].id;
                console.log(`Chat already exists for loan request ${loanRequestId}: ${chatId}`);
            } else {
                // Fetch participant profiles for chat creation
                const [borrowerProfileResult, lenderProfileResult] = await Promise.all([
                    client.models.PublicProfile.list({
                        filter: { userId: { eq: loanRequest.requesterId } }
                    }),
                    client.models.PublicProfile.list({
                        filter: { userId: { eq: loanRequest.lenderId } }
                    })
                ]);

                const borrowerProfile = borrowerProfileResult.data?.[0];
                const lenderProfile = lenderProfileResult.data?.[0];

                // SECURITY: Sanitize all inputs
                const safeBookTitle = sanitizeContent(book.title || 'Unknown Book', 100);
                const safeLenderEmail = sanitizeEmail(lenderProfile?.email || '');
                const safeLenderUsername = sanitizeUsername(lenderProfile?.username || userName);
                const safeBorrowerEmail = sanitizeEmail(borrowerProfile?.email || '');
                const safeBorrowerUsername = sanitizeUsername(borrowerProfile?.username || 'Borrower');

                // Validate sanitized inputs - email can be empty, but usernames are required
                if (!safeLenderUsername || !safeBorrowerUsername) {
                    console.error('Missing usernames for chat participants');
                    throw new Error('Missing participant usernames');
                }

                // Create chat with validated and sanitized data
                const chatResult = await client.models.Chat.create({
                    loanRequestId: loanRequestId,
                    lenderId: loanRequest.lenderId,
                    lenderEmail: safeLenderEmail,
                    lenderUsername: safeLenderUsername,
                    borrowerId: loanRequest.requesterId,
                    borrowerEmail: safeBorrowerEmail,
                    borrowerUsername: safeBorrowerUsername,
                    lenderUnreadCount: 0,
                    borrowerUnreadCount: 0
                });

                if (!chatResult.data) {
                    throw new Error('Failed to create chat record');
                }

                chatId = chatResult.data.id;

                // Create initial system message
                const safeSystemMessage = `Loan request approved! You can now coordinate the book handoff for "${safeBookTitle}".`;
                
                await client.models.Message.create({
                    chatId: chatId,
                    content: sanitizeContent(safeSystemMessage, 500),
                    messageType: 'system',
                    senderId: 'system',
                    senderEmail: 'system@bookexchange.com',
                    senderUsername: 'Book Exchange',
                    lenderId: loanRequest.lenderId,
                    borrowerId: loanRequest.requesterId,
                    isRead: false
                });

                console.log(`Successfully created chat ${chatId} for loan request ${loanRequestId}`);
            }
        } catch (chatError) {
            console.error('Failed to create chat during loan approval:', chatError);
            // Continue with approval even if chat creation fails - don't fail the entire operation
        }

        // STEP 5: Send notifications to both parties
        try {
            const safeBookTitle = sanitizeContent(book.title || 'Unknown Book', 100);
            const safeUserName = sanitizeUsername(userName);

            await Promise.all([
                // Notification to borrower
                client.models.Notification.create({
                    userId: loanRequest.requesterId,
                    type: 'handoff_ready',
                    title: 'Loan approved - Arrange pickup!',
                    message: sanitizeContent(`${safeUserName} has approved your request to borrow "${safeBookTitle}". Click to coordinate the book handoff.`),
                    loanRequestId: loanRequestId,
                    handoffId: handoffResult.data.id,
                    bookId: loanRequest.bookId
                }),
                // Notification to lender
                client.models.Notification.create({
                    userId: loanRequest.lenderId,
                    type: 'handoff_ready',
                    title: 'Loan approved - Arrange handoff!',
                    message: sanitizeContent(`You've approved the loan request for "${safeBookTitle}". Click to coordinate the book handoff with the borrower.`),
                    loanRequestId: loanRequestId,
                    handoffId: handoffResult.data.id,
                    bookId: loanRequest.bookId
                })
            ]);
        } catch (notificationError) {
            console.error('Failed to send notifications during loan approval:', notificationError);
            // Continue - notifications are not critical for loan approval
        }

        // Log successful loan approval for audit
        console.log(`Successfully approved loan request ${loanRequestId} by user ${currentUserId}, chat: ${chatId}`);

        return {
            success: true,
            loanRequestId: loanRequestId,
            chatId: chatId,
            message: 'Loan request approved successfully'
        };

    } catch (error) {
        // SECURITY: Don't leak sensitive information in error messages
        console.error('ApproveLoanRequest function error:', error);
        
        return {
            success: false,
            message: 'Internal server error occurred while approving loan request',
            error: 'INTERNAL_ERROR'
        };
    }
};