import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {fetchMapsApiKey} from "../functions/fetchMapsApiKey/resource";

const schema = a.schema({

    User: a
        .model({
            sub: a.id().required(), // Cognito user ID
            email: a.string().required(),
            address: a.string(),
            city: a.string(),
            postalCode: a.string(),
            coordinates: a.customType({
                lat: a.float().required(),
                long: a.float().required(),
            }),
            // Remove hasMany relations that might cause circular dependencies
            // books: a.hasMany("Book", "ownerId"),
            // sentLoanRequests: a.hasMany("LoanRequest", "requesterId"),
            // receivedLoanRequests: a.hasMany("LoanRequest", "lenderId"),
            // activeLoansAsBorrower: a.hasMany("ActiveLoan", "currentBorrowerId"),
            // activeLoansAsLender: a.hasMany("ActiveLoan", "originalOwnerId"),
        })
        .identifier(['sub'])
        .authorization((allow) => [allow.owner()]),

    Book: a.model({
        title: a.string().required(),
        author: a.string().required(),
        isbn: a.string(), // optional
        ownerId: a.string().required(), // Current owner (original owner or borrower)
        ownerEmail: a.string().required(),
        createdAt: a.timestamp().required(),

        // Loan status for original books
        loanedOut: a.boolean().required(),
        loanedTo: a.string(), // borrower ID when loaned out

        // For borrowed books (copies in borrower's library)
        isOriginalCopy: a.boolean().default(true), // false for borrowed books
        originalOwnerId: a.string(), // ID of actual owner (for borrowed books only)
        originalOwnerEmail: a.string(), // Email of actual owner (for borrowed books only)
        originalBookId: a.string(), // Reference to the original book record
        activeLoanId: a.string(), // reference to ActiveLoan record

        // Borrowing status and history
        borrowStatus: a.enum(['active', 'returned', 'overdue']), // null/undefined for owned books
        borrowedAt: a.timestamp(), // When the loan started
        returnedAt: a.timestamp(), // When the loan was returned
        dueDate: a.timestamp(), // When the loan is due

        // Optional: User feedback on returned books
        borrowerRating: a.integer(), // 1-5 stars (for returned books)
        borrowerNotes: a.string(), // Personal notes about the book
        wouldRecommend: a.boolean(), // Would recommend to others

        // Book metadata
        imageUrl: a.string(), // Book cover image URL
        imageSource: a.string(), // 'manual', 'google_books', or null
    }).authorization(allow => [
        allow.authenticated().to(['read']), // Anyone can see books for discovery
        allow.owner().to(['read', "create", "update", "delete"]), // Owner can manage
    ]),

    LoanRequest: a.model({
        requesterId: a.string().required(), // User who wants to borrow
        lenderId: a.string().required(), // User who owns the book
        bookId: a.string().required(), // Original book being requested
        status: a.enum(['pending', 'approved', 'rejected', 'meeting_arranged', 'completed', 'cancelled']),

        // Request details
        message: a.string(), // Optional message from requester
        proposedDuration: a.integer(), // Days, proposed by requester
        approvedDuration: a.integer(), // Days, set by lender when approving

        // Timestamps
        requestedAt: a.timestamp().required(),
        respondedAt: a.timestamp(), // When lender approved/rejected
        completedAt: a.timestamp(), // When handoff was completed

        // Calculated fields
        dueDate: a.timestamp(), // Calculated when loan is completed
    }).authorization(allow => [
        // Allow both requester and lender to read/update
        allow.authenticated().to(['read']),
        allow.owner().to(['create', 'read', 'update', 'delete']),
    ]),

    // Track the physical handoff process
    LoanHandoff: a.model({
        loanRequestId: a.string().required(),

        // Confirmation status
        lenderConfirmed: a.boolean().default(false),
        borrowerConfirmed: a.boolean().default(false),

        // Meeting details
        meetingLocation: a.string(),
        scheduledTime: a.timestamp(),

        // Confirmation timestamps
        lenderConfirmedAt: a.timestamp(),
        borrowerConfirmedAt: a.timestamp(),
        completedAt: a.timestamp(), // When both confirmed
    }).authorization(allow => [
        allow.authenticated().to(['read']),
        allow.owner().to(['create', 'read', 'update', 'delete']),
    ]),

    // Track active loans
    ActiveLoan: a.model({
        originalBookId: a.string().required(), // The original book record
        borrowedBookId: a.string().required(), // The borrowed copy record
        originalOwnerId: a.string().required(),
        currentBorrowerId: a.string().required(),
        loanRequestId: a.string().required(),

        // Loan period
        startDate: a.timestamp().required(),
        dueDate: a.timestamp(), // null for indefinite loans

        // Status tracking
        isOverdue: a.boolean().default(false),
        overdueNotificationsSent: a.integer().default(0),
    }).authorization(allow => [
        allow.authenticated().to(['read']),
        allow.owner().to(['create', 'read', 'update', 'delete']),
    ]),

    // Optional: Notifications system
    Notification: a.model({
        userId: a.string().required(),
        type: a.enum(['loan_request', 'loan_approved', 'loan_rejected', 'handoff_ready', 'book_overdue', 'book_returned']),
        title: a.string().required(),
        message: a.string().required(),
        isRead: a.boolean().default(false),
        createdAt: a.timestamp().required(),

        // Optional reference IDs
        loanRequestId: a.string(),
        bookId: a.string(),
    }).authorization(allow => [
        allow.owner().to(['create', 'read', 'update']), // Users can read and mark as read
    ]),

    fetchMapsApiKey: a
        .query()
        .returns(a.string())
        .authorization((allow) => [allow.authenticated()])
        .handler(a.handler.function(fetchMapsApiKey)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        // This tells the data client in your app (generateClient())
        // to sign API requests with the user authentication token.
        defaultAuthorizationMode: 'userPool',
    },
});