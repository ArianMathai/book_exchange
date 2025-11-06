import type { DynamoDBStreamHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/createActiveLoan';
import type { Schema } from '../../data/resource';

const logger = new Logger({
    logLevel: 'INFO',
    serviceName: 'createActiveLoan-stream-handler',
});

// Configure Amplify using the proper Gen 2 pattern
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

// Initialize Amplify client for server-side operations
const client = generateClient<Schema>();

// Simple content truncation for trusted database values
const truncateContent = (content: string, maxLength = 200): string => {
    if (!content) return '';
    return content.trim().slice(0, maxLength);
};

type CreateActiveLoanResult = {
    success: boolean;
    activeLoanId?: string;
    message: string;
    error?: string;
    retryCount?: number;
};

// Helper function to extract attribute value from DynamoDB record
const getAttributeValue = (item: any, key: string): any => {
    const attr = item?.[key];
    if (!attr) return null;

    // Handle different DynamoDB attribute types
    if (attr.S !== undefined) return attr.S; // String
    if (attr.N !== undefined) return Number(attr.N); // Number
    if (attr.BOOL !== undefined) return attr.BOOL; // Boolean
    if (attr.NULL) return null;

    return null;
};

// Helper function to process a single loan handoff completion with retry logic
const processLoanHandoffCompletion = async (loanHandoffId: string, retryCount = 0): Promise<CreateActiveLoanResult> => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second base delay

    logger.info(`Processing loan handoff completion: ${loanHandoffId}`, { attemptNumber: retryCount + 1, maxRetries });

    
    try {

        // Validate required parameters
        if (!loanHandoffId) {
            return {
                success: false,
                message: 'Missing required parameters',
                error: 'MISSING_PARAMETERS',
                retryCount
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

        // Note: No user authorization needed for stream-triggered events
        // The trigger itself provides the authorization (only fires when completedAt is set)

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
            logger.info(`Active loan already exists for loan request`, { loanRequestId: loanRequest.id, activeLoanId: existingActiveLoanResult.data[0].id });

            return {
                success: true,
                activeLoanId: existingActiveLoanResult.data[0].id,
                message: 'Active loan already exists (created by concurrent request)'
            };
        }

        // STEP 6.1: Check if borrowed book copy already exists
        const existingBorrowedBookResult = await client.models.Book.list({
            filter: {
                and: [
                    { originalBookId: { eq: originalBook.id } },
                    { ownerId: { eq: loanRequest.requesterId } },
                    { isOriginalCopy: { eq: false } }
                ]
            }
        });

        if (existingBorrowedBookResult.data && existingBorrowedBookResult.data.length > 0) {
            // Race condition: Another client already created the borrowed book copy
            // Check if there's an associated ActiveLoan for this borrowed book
            const borrowedBook = existingBorrowedBookResult.data[0];

            // Try to find existing ActiveLoan by borrowed book ID
            const existingActiveLoanByBookResult = await client.models.ActiveLoan.list({
                filter: { borrowedBookId: { eq: borrowedBook.id } }
            });

            if (existingActiveLoanByBookResult.data && existingActiveLoanByBookResult.data.length > 0) {
                logger.info(`Borrowed book copy and active loan already exist`, { loanRequestId: loanRequest.id });

                return {
                    success: true,
                    activeLoanId: existingActiveLoanByBookResult.data[0].id,
                    message: 'Borrowed book copy and active loan already exist (created by concurrent request)'
                };
            }

            
            // Borrowed book exists but no ActiveLoan - continue to create ActiveLoan with existing book
            logger.info(`Using existing borrowed book copy`, { loanRequestId: loanRequest.id, borrowedBookId: borrowedBook.id });
        }

        const currentTime = new Date();

        // STEP 7: Fetch borrower's public profile to get username
        const borrowerProfileResult = await client.models.PublicProfile.list({
            filter: { userId: { eq: loanRequest.requesterId } }
        });

        const borrowerProfile = borrowerProfileResult.data?.[0];
        if (!borrowerProfile) {
            return {
                success: false,
                message: 'Borrower public profile not found',
                error: 'BORROWER_PROFILE_NOT_FOUND'
            };
        }

        // STEP 7.1: Fetch original owner's public profile to get username
        const originalOwnerProfileResult = await client.models.PublicProfile.list({
            filter: { userId: { eq: loanRequest.lenderId } }
        });

        const originalOwnerProfile = originalOwnerProfileResult.data?.[0];
        if (!originalOwnerProfile) {
            return {
                success: false,
                message: 'Original owner public profile not found',
                error: 'ORIGINAL_OWNER_PROFILE_NOT_FOUND'
            };
        }

        // STEP 8: Create borrowed book copy for the borrower (or use existing one)
        let borrowedBook;

        if (existingBorrowedBookResult.data && existingBorrowedBookResult.data.length > 0) {
            // Use existing borrowed book copy
            borrowedBook = existingBorrowedBookResult.data[0];
            logger.info(`Using existing borrowed book copy`, { borrowedBookId: borrowedBook.id });
        } else {
            // Create new borrowed book copy
            const borrowedBookResult = await client.models.Book.create({
                title: originalBook.title,
                author: originalBook.author,
                isbn: originalBook.isbn,
                ownerId: loanRequest.requesterId, // Borrower is now the "owner" of this copy
                ownerEmail: borrowerProfile.email, // Use actual email from profile
                userName: borrowerProfile.username, // Use actual username from profile
                loanedOut: false, // This copy is not loaned out
                loanedTo: null,
                isOriginalCopy: false,
                originalOwnerId: loanRequest.lenderId,
                originalOwnerEmail: originalBook.ownerEmail,
                originalOwnerUsername: originalOwnerProfile.username,
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

            borrowedBook = borrowedBookResult.data;
            logger.info(`Created new borrowed book copy`, { borrowedBookId: borrowedBook.id });
        }

        // STEP 9: Create ActiveLoan record
        const activeLoanResult = await client.models.ActiveLoan.create({
            originalBookId: originalBook.id,
            borrowedBookId: borrowedBook.id,
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

        // STEP 10: Update original book to mark as loaned out
        await client.models.Book.update({
            id: originalBook.id,
            loanedOut: true,
            loanedTo: loanRequest.requesterId,
            loanedToUsername: borrowerProfile.username,
        });

        // STEP 11: Update borrowed book copy with activeLoanId reference
        await client.models.Book.update({
            id: borrowedBook.id,
            activeLoanId: activeLoanResult.data.id
        });

        // STEP 12: Update loan request status to completed and set completedAt
        await client.models.LoanRequest.update({
            id: loanRequest.id,
            status: 'completed',
            completedAt: currentTime.toISOString()
        });

        // STEP 13: Send notifications to both parties
        try {
            const safeBookTitle = truncateContent(originalBook.title || 'Unknown Book', 100);

            await Promise.all([
                // Notification to borrower
                client.models.Notification.create({
                    userId: loanRequest.requesterId,
                    type: 'loan_approved', // Using existing type, could add new 'loan_active' type
                    title: 'Loan is now active!',
                    message: truncateContent(`Your loan for "${safeBookTitle}" is now active. Remember to return it by the due date.`),
                    loanRequestId: loanRequest.id,
                    bookId: originalBook.id
                }),
                // Notification to lender
                client.models.Notification.create({
                    userId: loanRequest.lenderId,
                    type: 'loan_approved',
                    title: 'Book loan is now active!',
                    message: truncateContent(`Your book "${safeBookTitle}" has been successfully loaned out. You'll be notified when it's returned.`),
                    loanRequestId: loanRequest.id,
                    bookId: originalBook.id
                })
            ]);
        } catch (notificationError) {
            logger.error('Failed to send notifications during active loan creation', { error: notificationError });
            // Continue - notifications are not critical
        }

        // Log successful active loan creation for audit
        logger.info(`Successfully created active loan`, { activeLoanId: activeLoanResult.data.id, loanRequestId: loanRequest.id });

        return {
            success: true,
            activeLoanId: activeLoanResult.data.id,
            message: 'Active loan created successfully',
            retryCount
        };

    } catch (error) {
        logger.error(`CreateActiveLoan function error`, { error, attemptNumber: retryCount + 1 });

        // Retry logic with exponential backoff
        if (retryCount < maxRetries - 1) {
            const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
            logger.info(`Retrying after delay`, { delayMs: delay });

            await new Promise(resolve => setTimeout(resolve, delay));
            return processLoanHandoffCompletion(loanHandoffId, retryCount + 1);
        }

        // Final failure - send notifications to both parties
        await sendFailureNotifications(loanHandoffId, error, retryCount + 1);

        return {
            success: false,
            message: 'Failed to create active loan after multiple retries',
            error: 'INTERNAL_ERROR',
            retryCount: retryCount + 1
        };
    }
};

// Function to send failure notifications to both lender and borrower
const sendFailureNotifications = async (loanHandoffId: string, error: any, finalRetryCount: number) => {
    try {
        // Fetch handoff to get participant IDs
        const handoffResult = await client.models.LoanHandoff.get({ id: loanHandoffId });
        if (!handoffResult.data) {
            logger.error('Could not fetch handoff for failure notifications');
            return;
        }

        const handoff = handoffResult.data;
        const errorMessage = `Failed to create active loan after ${finalRetryCount} attempts. Please contact support.`;

        // Send notifications to both parties
        await Promise.all([
            client.models.Notification.create({
                userId: handoff.lenderId,
                type: 'loan_creation_failed',
                title: 'Loan Creation Failed',
                message: truncateContent(errorMessage),
                handoffId: loanHandoffId
            }),
            client.models.Notification.create({
                userId: handoff.requesterId,
                type: 'loan_creation_failed',
                title: 'Loan Creation Failed',
                message: truncateContent(errorMessage),
                handoffId: loanHandoffId
            })
        ]);

        logger.info(`Sent failure notifications`, { loanHandoffId });
    } catch (notificationError) {
        logger.error('Failed to send failure notifications', { error: notificationError });
    }
};

// Main DynamoDB Stream handler
export const handler: DynamoDBStreamHandler = async (event) => {
    logger.info('CreateActiveLoan DynamoDB Stream handler called', { recordCount: event.Records.length });

    const results: CreateActiveLoanResult[] = [];

    // Process each record in the stream
    for (const record of event.Records) {
        try {
            logger.info('Processing stream record', {
                eventName: record.eventName,
                eventSource: record.eventSource,
                tableName: record.dynamodb?.Keys ? Object.keys(record.dynamodb.Keys) : 'unknown'
            });

            // Only process MODIFY events
            if (record.eventName !== 'MODIFY') {
                logger.info(`Skipping non-MODIFY event`, { eventName: record.eventName });
                continue;
            }

            const newImage = record.dynamodb?.NewImage;
            const oldImage = record.dynamodb?.OldImage;

            if (!newImage || !oldImage) {
                logger.info('Skipping record without proper image data', {
                    hasNewImage: !!newImage,
                    hasOldImage: !!oldImage
                });
                continue;
            }

            // Parse attribute values
            const newCompletedAt = getAttributeValue(newImage, 'completedAt');
            const oldCompletedAt = getAttributeValue(oldImage, 'completedAt');
            const lenderConfirmed = getAttributeValue(newImage, 'lenderConfirmed');
            const borrowerConfirmed = getAttributeValue(newImage, 'borrowerConfirmed');
            const processedByStream = getAttributeValue(newImage, 'processedByStream');
            const loanHandoffId = getAttributeValue(newImage, 'id');

            if (!loanHandoffId) {
                logger.error('Could not extract handoff ID from record');
                continue;
            }

            // SCENARIO A: Both parties confirmed but completedAt not yet set
            if (lenderConfirmed && borrowerConfirmed && !newCompletedAt) {
                logger.info('Both parties confirmed - setting completedAt and creating loan', {
                    loanHandoffId
                });

                try {
                    // Atomically set completedAt and processedByStream flag (prevents race conditions)
                    await client.models.LoanHandoff.update({
                        id: loanHandoffId,
                        completedAt: new Date().toISOString(),
                        processedByStream: true
                    });

                    logger.info('CompletedAt and processedByStream flag set successfully, proceeding with loan creation');

                    // Immediately create active loan
                    const result = await processLoanHandoffCompletion(loanHandoffId);
                    results.push(result);

                } catch (updateError) {
                    // Check if error is due to completedAt already being set by another process
                    const errorMessage = updateError instanceof Error ? updateError.message : String(updateError);
                    if (errorMessage.includes('conditional')) {
                        logger.info('CompletedAt already set by another process - skipping');
                    } else {
                        logger.error('Failed to set completedAt', { error: updateError });
                        results.push({
                            success: false,
                            message: 'Failed to set completedAt',
                            error: 'COMPLETION_UPDATE_FAILED'
                        });
                    }
                }
                continue;
            }

            // SCENARIO B: CompletedAt was newly set (fallback scenario)
            if (newCompletedAt && !oldCompletedAt) {
                // Check if already processed by Scenario A
                if (processedByStream) {
                    logger.info('CompletedAt newly set but already processed by stream - skipping redundant processing', {
                        loanHandoffId
                    });
                    continue; // Skips loop iteration eg. does not try to create active loan if already processed
                }

                logger.info('CompletedAt was newly set - creating active loan (fallback)', {
                    loanHandoffId
                });

                // Verify both parties are confirmed before proceeding
                if (!lenderConfirmed || !borrowerConfirmed) {
                    logger.error('CompletedAt set but not all parties confirmed', {
                        lenderConfirmed,
                        borrowerConfirmed
                    });
                    continue;
                }

                // Create active loan
                const result = await processLoanHandoffCompletion(loanHandoffId);
                results.push(result);
                continue;
            }

            // SCENARIO C: Other updates (single confirmations, etc.)
            // Skipping - not a completion trigger

        } catch (recordError) {
            logger.error('Error processing stream record', { error: recordError });
            results.push({
                success: false,
                message: 'Error processing stream record',
                error: 'STREAM_PROCESSING_ERROR'
            });
        }
    }

    logger.info(`Completed stream processing`, { totalRecords: event.Records.length, processedResults: results.length });
    return;
};