import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {addressAutocomplete} from "../functions/addressAutocomplete/resource";
import {approveLoanRequest} from "../functions/approveLoanRequest/resource";

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
        // createdAt: a.datetime().required(),

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
        borrowedAt: a.datetime(), // When the loan started
        returnedAt: a.datetime(), // When the loan was returned
        dueDate: a.datetime(), // When the loan is due

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
        requestedAt: a.datetime().required(),
        respondedAt: a.datetime(), // When lender approved/rejected
        completedAt: a.datetime(), // When handoff was completed

        // Calculated fields
        dueDate: a.datetime(), // Calculated when loan is completed
        
        // Relationship to chat (one-to-one)
        chat: a.hasOne('Chat', 'loanRequestId'),
    }).authorization(allow => [
        // Allow both requester and lender to read/update
        allow.ownerDefinedIn("requesterId").to(['read', "create", "update"]),
        allow.ownerDefinedIn("lenderId").to(['read', "update"]),
    ]),

    // Track the physical handoff process
    LoanHandoff: a.model({
        loanRequestId: a.string().required(),
        lenderId: a.string().required(),
        requesterId: a.string().required(),

        // Confirmation status
        lenderConfirmed: a.boolean().default(false),
        borrowerConfirmed: a.boolean().default(false),

        // Meeting details
        meetingLocation: a.string(),
        scheduledTime: a.datetime(),

        // Confirmation timestamps
        lenderConfirmedAt: a.datetime(),
        borrowerConfirmedAt: a.datetime(),
        completedAt: a.datetime(), // When both confirmed
    }).authorization(allow => [
        allow.ownerDefinedIn("requesterId").to(['read', "update"]),
        allow.ownerDefinedIn("lenderId").to(['read', "update", "create"]),
    ]),

    // Track active loans
    ActiveLoan: a.model({
        originalBookId: a.string().required(), // The original book record
        borrowedBookId: a.string().required(), // The borrowed copy record
        originalOwnerId: a.string().required(),
        currentBorrowerId: a.string().required(),
        loanRequestId: a.string().required(),

        // Loan period
        startDate: a.datetime().required(),
        dueDate: a.datetime(), // null for indefinite loans

        // Status tracking
        isOverdue: a.boolean().default(false),
        overdueNotificationsSent: a.integer().default(0),
    }).authorization(allow => [
        allow.authenticated().to(['read']),
        allow.owner().to(['create', 'read', 'update', 'delete']),
    ]),

    // Public profile accessible to all authenticated users
    PublicProfile: a.model({
        userId: a.string().required(), // Reference to User.sub
        username: a.string().required(), // Display name
        email: a.string().required(), // Public email
        bio: a.string(), // Optional bio/description
    })
    .authorization(allow => [
        allow.ownerDefinedIn('userId'), // Owner can manage their profile
        allow.authenticated().to(['read']), // All authenticated users can read
    ]),

    // Optional: Notifications system
    Notification: a.model({
        userId: a.string().required(), // Receiver of notification
        type: a.enum(['loan_request', 'loan_approved', 'loan_rejected', 'handoff_ready', 'book_overdue', 'book_returned']),
        title: a.string().required(),
        message: a.string().required(),
        isRead: a.boolean().default(false),

        // Optional reference IDs
        loanRequestId: a.string(),
        handoffId: a.string(),
        bookId: a.string(),
    }).authorization(allow => [
        allow.authenticated().to(['create']), //TODO: Change this to custom auth rule so that creator of notification can create, but only owner can read + update
        allow.ownerDefinedIn('userId').to(['read','update']),
    ]),

    // Chat system for loan communications
    Chat: a.model({
        loanRequestId: a.id().required(), // Links to the loan request
        loanRequest: a.belongsTo('LoanRequest', 'loanRequestId'),
        
        // Participants
        lenderId: a.string().required(),
        lenderEmail: a.string().required(),
        lenderUsername: a.string(),
        borrowerId: a.string().required(),
        borrowerEmail: a.string().required(),
        borrowerUsername: a.string(),
        
        // Chat metadata
        lastMessageAt: a.datetime(),
        lastMessagePreview: a.string(),
        
        // Message counts for unread indicators
        lenderUnreadCount: a.integer().default(0),
        borrowerUnreadCount: a.integer().default(0),
        
        // Relationship to messages
        messages: a.hasMany('Message', 'chatId'),
    })
    .authorization(allow => [
        // SECURITY: Completely removed 'create' permission - chat creation only through custom mutation
        // Only participants can read and update their chats
        allow.ownerDefinedIn('lenderId').to(['read', 'update']),
        allow.ownerDefinedIn('borrowerId').to(['read', 'update']),
    ]),

    // Individual messages within chats
    Message: a.model({
        chatId: a.id().required(), // Reference to Chat
        chat: a.belongsTo('Chat', 'chatId'),
        
        // Message content
        content: a.string().required(),
        messageType: a.enum(['text', 'system']),
        
        // Sender info
        senderId: a.string().required(),
        senderEmail: a.string().required(),
        senderUsername: a.string().required(),

        // Copy from parent chat for authorization (chat-level access)
        lenderId: a.string().required(),
        borrowerId: a.string().required(),
        
        // Message status
        isRead: a.boolean().default(false),
        readAt: a.datetime(),
    }).authorization(allow => [
        allow.ownerDefinedIn('senderId').to(['create', 'update']),
        allow.ownerDefinedIn('lenderId').to(['read']),
        allow.ownerDefinedIn('borrowerId').to(['read']),
    ]),

    // Custom types for address functionality
    AddressSuggestion: a.customType({
        description: a.string().required(),
        place_id: a.string().required(),
    }),

    AddressSearchResult: a.customType({
        suggestions: a.ref('AddressSuggestion').array().required(),
    }),

    AddressDetails: a.customType({
        address: a.string().required(),
        city: a.string().required(),
        postalCode: a.string().required(),
        latitude: a.float(),
        longitude: a.float(),
    }),

    // Custom queries
    searchAddresses: a
        .query()
        .arguments({
            input: a.string().required(),
            types: a.string().array(), // Optional: ['address', 'geocode', etc.]
        })
        .returns(a.ref('AddressSearchResult'))
        .handler(a.handler.function(addressAutocomplete))
        .authorization((allow) => [allow.authenticated()]),

    reverseGeocode: a
        .query()
        .arguments({
            lat: a.float().required(),
            lng: a.float().required(),
        })
        .returns(a.ref('AddressDetails'))
        .handler(a.handler.function(addressAutocomplete))
        .authorization((allow) => [allow.authenticated()]),

    getPlaceDetails: a
        .query()
        .arguments({
            place_id: a.string().required(),
        })
        .returns(a.ref('AddressDetails').required())
        .handler(a.handler.function(addressAutocomplete))
        .authorization((allow) => [allow.authenticated()]),

    // SECURITY: Secure loan approval mutation with automatic chat creation
    // This replaces both loan approval and chat creation in one atomic operation
    approveLoanRequestMutation: a
        .mutation()
        .arguments({
            loanRequestId: a.string().required(),
            approvedDuration: a.integer().required(),
            userName: a.string().required(),
        })
        .returns(a.customType({
            success: a.boolean().required(),
            loanRequestId: a.string(),
            chatId: a.string(),
            message: a.string().required(),
            error: a.string(),
        }))
        .handler(a.handler.function(approveLoanRequest))
        .authorization((allow) => [allow.authenticated()]),

}).authorization((allow) => [
    // Grant Lambda function access to the entire API for approving loanRequests
    allow.resource(approveLoanRequest)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        // This tells the data client in your app (generateClient())
        // to sign API requests with the user authentication token.
        defaultAuthorizationMode: 'userPool',
    },
});