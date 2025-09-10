/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateActiveLoan = /* GraphQL */ `subscription OnCreateActiveLoan(
  $filter: ModelSubscriptionActiveLoanFilterInput
  $owner: String
) {
  onCreateActiveLoan(filter: $filter, owner: $owner) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
    owner
    startDate
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateActiveLoanSubscriptionVariables,
  APITypes.OnCreateActiveLoanSubscription
>;
export const onCreateBook = /* GraphQL */ `subscription OnCreateBook(
  $filter: ModelSubscriptionBookFilterInput
  $owner: String
) {
  onCreateBook(filter: $filter, owner: $owner) {
    activeLoanId
    author
    borrowStatus
    borrowedAt
    borrowerNotes
    borrowerRating
    createdAt
    dueDate
    id
    imageSource
    imageUrl
    isOriginalCopy
    isbn
    loanedOut
    loanedTo
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateBookSubscriptionVariables,
  APITypes.OnCreateBookSubscription
>;
export const onCreateChatMessage = /* GraphQL */ `subscription OnCreateChatMessage(
  $filter: ModelSubscriptionChatMessageFilterInput
) {
  onCreateChatMessage(filter: $filter) {
    chatId
    content
    createdAt
    editedAt
    id
    isEdited
    isRead
    isSystemMessage
    messageType
    metadata
    readAt
    senderId
    senderRole
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateChatMessageSubscriptionVariables,
  APITypes.OnCreateChatMessageSubscription
>;
export const onCreateLoanChat = /* GraphQL */ `subscription OnCreateLoanChat($filter: ModelSubscriptionLoanChatFilterInput) {
  onCreateLoanChat(filter: $filter) {
    activeLoanId
    bookId
    borrowerId
    borrowerUnreadCount
    closedAt
    closedReason
    createdAt
    handoffId
    id
    isActive
    lastMessageAt
    lenderId
    lenderUnreadCount
    loanRequestId
    stage
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLoanChatSubscriptionVariables,
  APITypes.OnCreateLoanChatSubscription
>;
export const onCreateLoanHandoff = /* GraphQL */ `subscription OnCreateLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $owner: String
) {
  onCreateLoanHandoff(filter: $filter, owner: $owner) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    loanRequestId
    meetingLocation
    owner
    scheduledTime
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLoanHandoffSubscriptionVariables,
  APITypes.OnCreateLoanHandoffSubscription
>;
export const onCreateLoanRequest = /* GraphQL */ `subscription OnCreateLoanRequest(
  $filter: ModelSubscriptionLoanRequestFilterInput
  $owner: String
) {
  onCreateLoanRequest(filter: $filter, owner: $owner) {
    approvedDuration
    bookId
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
    owner
    proposedDuration
    requestedAt
    requesterId
    respondedAt
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLoanRequestSubscriptionVariables,
  APITypes.OnCreateLoanRequestSubscription
>;
export const onCreateNotification = /* GraphQL */ `subscription OnCreateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
  $userId: String
) {
  onCreateNotification(filter: $filter, userId: $userId) {
    bookId
    createdAt
    handoffId
    id
    isRead
    loanRequestId
    message
    title
    type
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateNotificationSubscriptionVariables,
  APITypes.OnCreateNotificationSubscription
>;
export const onCreatePublicProfile = /* GraphQL */ `subscription OnCreatePublicProfile(
  $filter: ModelSubscriptionPublicProfileFilterInput
  $userId: String
) {
  onCreatePublicProfile(filter: $filter, userId: $userId) {
    bio
    createdAt
    email
    id
    updatedAt
    userId
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePublicProfileSubscriptionVariables,
  APITypes.OnCreatePublicProfileSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onCreateUser(filter: $filter, owner: $owner) {
    address
    city
    coordinates {
      lat
      long
      __typename
    }
    createdAt
    email
    owner
    postalCode
    sub
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteActiveLoan = /* GraphQL */ `subscription OnDeleteActiveLoan(
  $filter: ModelSubscriptionActiveLoanFilterInput
  $owner: String
) {
  onDeleteActiveLoan(filter: $filter, owner: $owner) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
    owner
    startDate
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteActiveLoanSubscriptionVariables,
  APITypes.OnDeleteActiveLoanSubscription
>;
export const onDeleteBook = /* GraphQL */ `subscription OnDeleteBook(
  $filter: ModelSubscriptionBookFilterInput
  $owner: String
) {
  onDeleteBook(filter: $filter, owner: $owner) {
    activeLoanId
    author
    borrowStatus
    borrowedAt
    borrowerNotes
    borrowerRating
    createdAt
    dueDate
    id
    imageSource
    imageUrl
    isOriginalCopy
    isbn
    loanedOut
    loanedTo
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteBookSubscriptionVariables,
  APITypes.OnDeleteBookSubscription
>;
export const onDeleteChatMessage = /* GraphQL */ `subscription OnDeleteChatMessage(
  $filter: ModelSubscriptionChatMessageFilterInput
) {
  onDeleteChatMessage(filter: $filter) {
    chatId
    content
    createdAt
    editedAt
    id
    isEdited
    isRead
    isSystemMessage
    messageType
    metadata
    readAt
    senderId
    senderRole
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteChatMessageSubscriptionVariables,
  APITypes.OnDeleteChatMessageSubscription
>;
export const onDeleteLoanChat = /* GraphQL */ `subscription OnDeleteLoanChat($filter: ModelSubscriptionLoanChatFilterInput) {
  onDeleteLoanChat(filter: $filter) {
    activeLoanId
    bookId
    borrowerId
    borrowerUnreadCount
    closedAt
    closedReason
    createdAt
    handoffId
    id
    isActive
    lastMessageAt
    lenderId
    lenderUnreadCount
    loanRequestId
    stage
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLoanChatSubscriptionVariables,
  APITypes.OnDeleteLoanChatSubscription
>;
export const onDeleteLoanHandoff = /* GraphQL */ `subscription OnDeleteLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $owner: String
) {
  onDeleteLoanHandoff(filter: $filter, owner: $owner) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    loanRequestId
    meetingLocation
    owner
    scheduledTime
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLoanHandoffSubscriptionVariables,
  APITypes.OnDeleteLoanHandoffSubscription
>;
export const onDeleteLoanRequest = /* GraphQL */ `subscription OnDeleteLoanRequest(
  $filter: ModelSubscriptionLoanRequestFilterInput
  $owner: String
) {
  onDeleteLoanRequest(filter: $filter, owner: $owner) {
    approvedDuration
    bookId
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
    owner
    proposedDuration
    requestedAt
    requesterId
    respondedAt
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLoanRequestSubscriptionVariables,
  APITypes.OnDeleteLoanRequestSubscription
>;
export const onDeleteNotification = /* GraphQL */ `subscription OnDeleteNotification(
  $filter: ModelSubscriptionNotificationFilterInput
  $userId: String
) {
  onDeleteNotification(filter: $filter, userId: $userId) {
    bookId
    createdAt
    handoffId
    id
    isRead
    loanRequestId
    message
    title
    type
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteNotificationSubscriptionVariables,
  APITypes.OnDeleteNotificationSubscription
>;
export const onDeletePublicProfile = /* GraphQL */ `subscription OnDeletePublicProfile(
  $filter: ModelSubscriptionPublicProfileFilterInput
  $userId: String
) {
  onDeletePublicProfile(filter: $filter, userId: $userId) {
    bio
    createdAt
    email
    id
    updatedAt
    userId
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePublicProfileSubscriptionVariables,
  APITypes.OnDeletePublicProfileSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onDeleteUser(filter: $filter, owner: $owner) {
    address
    city
    coordinates {
      lat
      long
      __typename
    }
    createdAt
    email
    owner
    postalCode
    sub
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateActiveLoan = /* GraphQL */ `subscription OnUpdateActiveLoan(
  $filter: ModelSubscriptionActiveLoanFilterInput
  $owner: String
) {
  onUpdateActiveLoan(filter: $filter, owner: $owner) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
    owner
    startDate
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateActiveLoanSubscriptionVariables,
  APITypes.OnUpdateActiveLoanSubscription
>;
export const onUpdateBook = /* GraphQL */ `subscription OnUpdateBook(
  $filter: ModelSubscriptionBookFilterInput
  $owner: String
) {
  onUpdateBook(filter: $filter, owner: $owner) {
    activeLoanId
    author
    borrowStatus
    borrowedAt
    borrowerNotes
    borrowerRating
    createdAt
    dueDate
    id
    imageSource
    imageUrl
    isOriginalCopy
    isbn
    loanedOut
    loanedTo
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateBookSubscriptionVariables,
  APITypes.OnUpdateBookSubscription
>;
export const onUpdateChatMessage = /* GraphQL */ `subscription OnUpdateChatMessage(
  $filter: ModelSubscriptionChatMessageFilterInput
) {
  onUpdateChatMessage(filter: $filter) {
    chatId
    content
    createdAt
    editedAt
    id
    isEdited
    isRead
    isSystemMessage
    messageType
    metadata
    readAt
    senderId
    senderRole
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateChatMessageSubscriptionVariables,
  APITypes.OnUpdateChatMessageSubscription
>;
export const onUpdateLoanChat = /* GraphQL */ `subscription OnUpdateLoanChat($filter: ModelSubscriptionLoanChatFilterInput) {
  onUpdateLoanChat(filter: $filter) {
    activeLoanId
    bookId
    borrowerId
    borrowerUnreadCount
    closedAt
    closedReason
    createdAt
    handoffId
    id
    isActive
    lastMessageAt
    lenderId
    lenderUnreadCount
    loanRequestId
    stage
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLoanChatSubscriptionVariables,
  APITypes.OnUpdateLoanChatSubscription
>;
export const onUpdateLoanHandoff = /* GraphQL */ `subscription OnUpdateLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $owner: String
) {
  onUpdateLoanHandoff(filter: $filter, owner: $owner) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    loanRequestId
    meetingLocation
    owner
    scheduledTime
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLoanHandoffSubscriptionVariables,
  APITypes.OnUpdateLoanHandoffSubscription
>;
export const onUpdateLoanRequest = /* GraphQL */ `subscription OnUpdateLoanRequest(
  $filter: ModelSubscriptionLoanRequestFilterInput
  $owner: String
) {
  onUpdateLoanRequest(filter: $filter, owner: $owner) {
    approvedDuration
    bookId
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
    owner
    proposedDuration
    requestedAt
    requesterId
    respondedAt
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLoanRequestSubscriptionVariables,
  APITypes.OnUpdateLoanRequestSubscription
>;
export const onUpdateNotification = /* GraphQL */ `subscription OnUpdateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
  $userId: String
) {
  onUpdateNotification(filter: $filter, userId: $userId) {
    bookId
    createdAt
    handoffId
    id
    isRead
    loanRequestId
    message
    title
    type
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateNotificationSubscriptionVariables,
  APITypes.OnUpdateNotificationSubscription
>;
export const onUpdatePublicProfile = /* GraphQL */ `subscription OnUpdatePublicProfile(
  $filter: ModelSubscriptionPublicProfileFilterInput
  $userId: String
) {
  onUpdatePublicProfile(filter: $filter, userId: $userId) {
    bio
    createdAt
    email
    id
    updatedAt
    userId
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePublicProfileSubscriptionVariables,
  APITypes.OnUpdatePublicProfileSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onUpdateUser(filter: $filter, owner: $owner) {
    address
    city
    coordinates {
      lat
      long
      __typename
    }
    createdAt
    email
    owner
    postalCode
    sub
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
