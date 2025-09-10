/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateActiveLoan = /* GraphQL */ `subscription OnCreateActiveLoan(
  $currentBorrowerId: String
  $filter: ModelSubscriptionActiveLoanFilterInput
  $originalOwnerId: String
) {
  onCreateActiveLoan(
    currentBorrowerId: $currentBorrowerId
    filter: $filter
    originalOwnerId: $originalOwnerId
  ) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
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
    loanedToUsername
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    userName
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateBookSubscriptionVariables,
  APITypes.OnCreateBookSubscription
>;
export const onCreateChat = /* GraphQL */ `subscription OnCreateChat(
  $borrowerId: String
  $filter: ModelSubscriptionChatFilterInput
  $lenderId: String
) {
  onCreateChat(borrowerId: $borrowerId, filter: $filter, lenderId: $lenderId) {
    borrowerEmail
    borrowerId
    borrowerUnreadCount
    borrowerUsername
    createdAt
    id
    lastMessageAt
    lastMessagePreview
    lenderEmail
    lenderId
    lenderUnreadCount
    lenderUsername
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    messages {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateChatSubscriptionVariables,
  APITypes.OnCreateChatSubscription
>;
export const onCreateLoanHandoff = /* GraphQL */ `subscription OnCreateLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $lenderId: String
  $requesterId: String
) {
  onCreateLoanHandoff(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    lenderId
    loanRequestId
    meetingLocation
    requesterId
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
  $lenderId: String
  $requesterId: String
) {
  onCreateLoanRequest(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    activeLoan {
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
      startDate
      updatedAt
      __typename
    }
    approvedDuration
    bookId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
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
export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage(
  $borrowerId: String
  $filter: ModelSubscriptionMessageFilterInput
  $lenderId: String
) {
  onCreateMessage(
    borrowerId: $borrowerId
    filter: $filter
    lenderId: $lenderId
  ) {
    borrowerId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    chatId
    content
    createdAt
    id
    isRead
    lenderId
    messageType
    readAt
    senderEmail
    senderId
    senderUsername
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
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
  $currentBorrowerId: String
  $filter: ModelSubscriptionActiveLoanFilterInput
  $originalOwnerId: String
) {
  onDeleteActiveLoan(
    currentBorrowerId: $currentBorrowerId
    filter: $filter
    originalOwnerId: $originalOwnerId
  ) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
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
    loanedToUsername
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    userName
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteBookSubscriptionVariables,
  APITypes.OnDeleteBookSubscription
>;
export const onDeleteChat = /* GraphQL */ `subscription OnDeleteChat(
  $borrowerId: String
  $filter: ModelSubscriptionChatFilterInput
  $lenderId: String
) {
  onDeleteChat(borrowerId: $borrowerId, filter: $filter, lenderId: $lenderId) {
    borrowerEmail
    borrowerId
    borrowerUnreadCount
    borrowerUsername
    createdAt
    id
    lastMessageAt
    lastMessagePreview
    lenderEmail
    lenderId
    lenderUnreadCount
    lenderUsername
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    messages {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteChatSubscriptionVariables,
  APITypes.OnDeleteChatSubscription
>;
export const onDeleteLoanHandoff = /* GraphQL */ `subscription OnDeleteLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $lenderId: String
  $requesterId: String
) {
  onDeleteLoanHandoff(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    lenderId
    loanRequestId
    meetingLocation
    requesterId
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
  $lenderId: String
  $requesterId: String
) {
  onDeleteLoanRequest(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    activeLoan {
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
      startDate
      updatedAt
      __typename
    }
    approvedDuration
    bookId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
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
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage(
  $borrowerId: String
  $filter: ModelSubscriptionMessageFilterInput
  $lenderId: String
) {
  onDeleteMessage(
    borrowerId: $borrowerId
    filter: $filter
    lenderId: $lenderId
  ) {
    borrowerId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    chatId
    content
    createdAt
    id
    isRead
    lenderId
    messageType
    readAt
    senderEmail
    senderId
    senderUsername
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessageSubscriptionVariables,
  APITypes.OnDeleteMessageSubscription
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
  $currentBorrowerId: String
  $filter: ModelSubscriptionActiveLoanFilterInput
  $originalOwnerId: String
) {
  onUpdateActiveLoan(
    currentBorrowerId: $currentBorrowerId
    filter: $filter
    originalOwnerId: $originalOwnerId
  ) {
    borrowedBookId
    createdAt
    currentBorrowerId
    dueDate
    id
    isOverdue
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    originalBookId
    originalOwnerId
    overdueNotificationsSent
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
    loanedToUsername
    originalBookId
    originalOwnerEmail
    originalOwnerId
    owner
    ownerEmail
    ownerId
    returnedAt
    title
    updatedAt
    userName
    wouldRecommend
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateBookSubscriptionVariables,
  APITypes.OnUpdateBookSubscription
>;
export const onUpdateChat = /* GraphQL */ `subscription OnUpdateChat(
  $borrowerId: String
  $filter: ModelSubscriptionChatFilterInput
  $lenderId: String
) {
  onUpdateChat(borrowerId: $borrowerId, filter: $filter, lenderId: $lenderId) {
    borrowerEmail
    borrowerId
    borrowerUnreadCount
    borrowerUsername
    createdAt
    id
    lastMessageAt
    lastMessagePreview
    lenderEmail
    lenderId
    lenderUnreadCount
    lenderUsername
    loanRequest {
      approvedDuration
      bookId
      completedAt
      createdAt
      dueDate
      id
      lenderId
      message
      proposedDuration
      requestedAt
      requesterId
      respondedAt
      status
      updatedAt
      __typename
    }
    loanRequestId
    messages {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateChatSubscriptionVariables,
  APITypes.OnUpdateChatSubscription
>;
export const onUpdateLoanHandoff = /* GraphQL */ `subscription OnUpdateLoanHandoff(
  $filter: ModelSubscriptionLoanHandoffFilterInput
  $lenderId: String
  $requesterId: String
) {
  onUpdateLoanHandoff(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    borrowerConfirmed
    borrowerConfirmedAt
    completedAt
    createdAt
    id
    lenderConfirmed
    lenderConfirmedAt
    lenderId
    loanRequestId
    meetingLocation
    requesterId
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
  $lenderId: String
  $requesterId: String
) {
  onUpdateLoanRequest(
    filter: $filter
    lenderId: $lenderId
    requesterId: $requesterId
  ) {
    activeLoan {
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
      startDate
      updatedAt
      __typename
    }
    approvedDuration
    bookId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    completedAt
    createdAt
    dueDate
    id
    lenderId
    message
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
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage(
  $borrowerId: String
  $filter: ModelSubscriptionMessageFilterInput
  $lenderId: String
) {
  onUpdateMessage(
    borrowerId: $borrowerId
    filter: $filter
    lenderId: $lenderId
  ) {
    borrowerId
    chat {
      borrowerEmail
      borrowerId
      borrowerUnreadCount
      borrowerUsername
      createdAt
      id
      lastMessageAt
      lastMessagePreview
      lenderEmail
      lenderId
      lenderUnreadCount
      lenderUsername
      loanRequestId
      updatedAt
      __typename
    }
    chatId
    content
    createdAt
    id
    isRead
    lenderId
    messageType
    readAt
    senderEmail
    senderId
    senderUsername
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMessageSubscriptionVariables,
  APITypes.OnUpdateMessageSubscription
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
