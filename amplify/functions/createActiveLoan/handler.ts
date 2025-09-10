import type { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/createActiveLoan';
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

const sanitizeContent = (content: string, maxLength = 500): string => {
    return sanitizeInput(content, maxLength);
};

type CreateActiveLoanArgs = {
    loanHandoffId: string;
};

type CreateActiveLoanResult = {
    success: boolean;
    activeLoanId?: string;
    message: string;
    error?: string;
};

export const handler: AppSyncResolverHandler<CreateActiveLoanArgs, CreateActiveLoanResult> = async (event) => {
    console.log('CreateActiveLoan function called with:', JSON.stringify(event, null, 2));
    
    try {
        const { loanHandoffId } = event.arguments;
        const identity = event.identity as AppSyncIdentityCognito;
        const currentUserId = identity?.sub;

        // SECURITY: Validate required parameters
        if (!loanHandoffId || !currentUserId) {
            return {
                success: false,
                message: 'Missing required parameters',
                error: 'MISSING_PARAMETERS'
            };
        }

        // STEP 1: Fetch and validate loan handoff
        const handoffResult = await client.models.LoanHandoff.get({ 
            id: loanHandoffId 
        });

        if (!handoffResult.data) {
            return {
                success: false,
                message: 'Loan handoff not found',
                error: 'HANDOFF_NOT_FOUND'
            };
        }

        const handoff = handoffResult.data;

        // SECURITY: Validate current user is involved in this handoff
        if (handoff.lenderId !== currentUserId && handoff.requesterId !== currentUserId) {
            console.warn(`Unauthorized active loan creation attempt: User ${currentUserId} tried to create active loan for handoff ${loanHandoffId}`);
            return {
                success: false,
                message: 'Unauthorized: You are not involved in this handoff',
                error: 'UNAUTHORIZED'
            };
        }

        // STEP 2: Validate both parties have confirmed
        if (!handoff.lenderConfirmed || !handoff.borrowerConfirmed) {
            return {
                success: false,
                message: 'Both parties must confirm the handoff before creating active loan',
                error: 'HANDOFF_NOT_COMPLETED'
            };
        }

        // STEP 3: Fetch loan request
        const loanRequestResult = await client.models.LoanRequest.get({
            id: handoff.loanRequestId
        });

        if (!loanRequestResult.data) {
            return {
                success: false,
                message: 'Associated loan request not found',
                error: 'LOAN_REQUEST_NOT_FOUND'
            };
        }

        const loanRequest = loanRequestResult.data;

        // STEP 4: Validate loan request status
        if (loanRequest.status !== 'meeting_arranged') {
            return {
                success: false,
                message: `Cannot create active loan for loan request with status: ${loanRequest.status}`,
                error: 'INVALID_STATUS'
            };
        }

        // STEP 5: Fetch original book
        const bookResult = await client.models.Book.get({
            id: loanRequest.bookId
        });

        if (!bookResult.data) {
            return {
                success: false,
                message: 'Original book not found',
                error: 'BOOK_NOT_FOUND'
            };
        }

        const originalBook = bookResult.data;

        // STEP 6: Check if ActiveLoan already exists
        const existingActiveLoanResult = await client.models.ActiveLoan.list({
            filter: { loanRequestId: { eq: loanRequest.id } }
        });

        if (existingActiveLoanResult.data && existingActiveLoanResult.data.length > 0) {
            // Race condition: Another client already created the active loan
            // Return success instead of error to prevent client-side failures
            console.log(`Active loan already exists for loan request ${loanRequest.id}: ${existingActiveLoanResult.data[0].id}`);
            return {
                success: true,
                activeLoanId: existingActiveLoanResult.data[0].id,
                message: 'Active loan already exists (created by concurrent request)'
            };
        }

        const currentTime = new Date();

        // STEP 7: Create borrowed book copy for the borrower
        const borrowedBookResult = await client.models.Book.create({
            title: originalBook.title,
            author: originalBook.author,
            isbn: originalBook.isbn,
            ownerId: loanRequest.requesterId, // Borrower is now the "owner" of this copy
            ownerEmail: loanRequest.requesterId, //TODO: Will need to fetch actual email if needed
            loanedOut: false, // This copy is not loaned out
            loanedTo: null,
            isOriginalCopy: false,
            originalOwnerId: loanRequest.lenderId,
            originalOwnerEmail: originalBook.ownerEmail,
            originalBookId: originalBook.id,
            borrowStatus: 'active',
            borrowedAt: currentTime.toISOString(),
            dueDate: loanRequest.dueDate,
            imageUrl: originalBook.imageUrl,
            imageSource: originalBook.imageSource
        });

        if (!borrowedBookResult.data) {
            throw new Error('Failed to create borrowed book copy');
        }

        // STEP 8: Create ActiveLoan record
        const activeLoanResult = await client.models.ActiveLoan.create({
            originalBookId: originalBook.id,
            borrowedBookId: borrowedBookResult.data.id,
            originalOwnerId: loanRequest.lenderId,
            currentBorrowerId: loanRequest.requesterId,
            loanRequestId: loanRequest.id,
            startDate: currentTime.toISOString(),
            dueDate: loanRequest.dueDate,
            isOverdue: false,
            overdueNotificationsSent: 0
        });

        if (!activeLoanResult.data) {
            throw new Error('Failed to create active loan record');
        }

        // STEP 9: Update original book to mark as loaned out
        await client.models.Book.update({
            id: originalBook.id,
            loanedOut: true,
            loanedTo: loanRequest.requesterId
        });

        // STEP 10: Update borrowed book copy with activeLoanId reference
        await client.models.Book.update({
            id: borrowedBookResult.data.id,
            activeLoanId: activeLoanResult.data.id
        });

        // STEP 11: Update loan request status to completed and set completedAt
        await client.models.LoanRequest.update({
            id: loanRequest.id,
            status: 'completed',
            completedAt: currentTime.toISOString()
        });

        // STEP 12: Send notifications to both parties
        try {
            const safeBookTitle = sanitizeContent(originalBook.title || 'Unknown Book', 100);

            await Promise.all([
                // Notification to borrower
                client.models.Notification.create({
                    userId: loanRequest.requesterId,
                    type: 'loan_approved', // Using existing type, could add new 'loan_active' type
                    title: 'Loan is now active!',
                    message: sanitizeContent(`Your loan for "${safeBookTitle}" is now active. Remember to return it by the due date.`),
                    loanRequestId: loanRequest.id,
                    bookId: originalBook.id
                }),
                // Notification to lender
                client.models.Notification.create({
                    userId: loanRequest.lenderId,
                    type: 'loan_approved',
                    title: 'Book loan is now active!',
                    message: sanitizeContent(`Your book "${safeBookTitle}" has been successfully loaned out. You'll be notified when it's returned.`),
                    loanRequestId: loanRequest.id,
                    bookId: originalBook.id
                })
            ]);
        } catch (notificationError) {
            console.error('Failed to send notifications during active loan creation:', notificationError);
            // Continue - notifications are not critical
        }

        // Log successful active loan creation for audit
        console.log(`Successfully created active loan ${activeLoanResult.data.id} for loan request ${loanRequest.id}`);

        return {
            success: true,
            activeLoanId: activeLoanResult.data.id,
            message: 'Active loan created successfully'
        };

    } catch (error) {
        // SECURITY: Don't leak sensitive information in error messages
        console.error('CreateActiveLoan function error:', error);
        
        return {
            success: false,
            message: 'Internal server error occurred while creating active loan',
            error: 'INTERNAL_ERROR'
        };
    }
};