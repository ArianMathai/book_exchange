/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const approveLoanRequestMutation = /* GraphQL */ `mutation ApproveLoanRequestMutation(
  $approvedDuration: Int!
  $loanRequestId: String!
  $userName: String!
) {
  approveLoanRequestMutation(
    approvedDuration: $approvedDuration
    loanRequestId: $loanRequestId
    userName: $userName
  ) {
    chatId
    error
    loanRequestId
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ApproveLoanRequestMutationMutationVariables,
  APITypes.ApproveLoanRequestMutationMutation
>;
export const createActiveLoan = /* GraphQL */ `mutation CreateActiveLoan(
  $condition: ModelActiveLoanConditionInput
  $input: CreateActiveLoanInput!
) {
  createActiveLoan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateActiveLoanMutationVariables,
  APITypes.CreateActiveLoanMutation
>;
export const createBook = /* GraphQL */ `mutation CreateBook(
  $condition: ModelBookConditionInput
  $input: CreateBookInput!
) {
  createBook(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBookMutationVariables,
  APITypes.CreateBookMutation
>;
export const createChat = /* GraphQL */ `mutation CreateChat(
  $condition: ModelChatConditionInput
  $input: CreateChatInput!
) {
  createChat(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateChatMutationVariables,
  APITypes.CreateChatMutation
>;
export const createLoanHandoff = /* GraphQL */ `mutation CreateLoanHandoff(
  $condition: ModelLoanHandoffConditionInput
  $input: CreateLoanHandoffInput!
) {
  createLoanHandoff(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateLoanHandoffMutationVariables,
  APITypes.CreateLoanHandoffMutation
>;
export const createLoanRequest = /* GraphQL */ `mutation CreateLoanRequest(
  $condition: ModelLoanRequestConditionInput
  $input: CreateLoanRequestInput!
) {
  createLoanRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateLoanRequestMutationVariables,
  APITypes.CreateLoanRequestMutation
>;
export const createMessage = /* GraphQL */ `mutation CreateMessage(
  $condition: ModelMessageConditionInput
  $input: CreateMessageInput!
) {
  createMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const createNotification = /* GraphQL */ `mutation CreateNotification(
  $condition: ModelNotificationConditionInput
  $input: CreateNotificationInput!
) {
  createNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateNotificationMutationVariables,
  APITypes.CreateNotificationMutation
>;
export const createPublicProfile = /* GraphQL */ `mutation CreatePublicProfile(
  $condition: ModelPublicProfileConditionInput
  $input: CreatePublicProfileInput!
) {
  createPublicProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePublicProfileMutationVariables,
  APITypes.CreatePublicProfileMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteActiveLoan = /* GraphQL */ `mutation DeleteActiveLoan(
  $condition: ModelActiveLoanConditionInput
  $input: DeleteActiveLoanInput!
) {
  deleteActiveLoan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteActiveLoanMutationVariables,
  APITypes.DeleteActiveLoanMutation
>;
export const deleteBook = /* GraphQL */ `mutation DeleteBook(
  $condition: ModelBookConditionInput
  $input: DeleteBookInput!
) {
  deleteBook(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBookMutationVariables,
  APITypes.DeleteBookMutation
>;
export const deleteChat = /* GraphQL */ `mutation DeleteChat(
  $condition: ModelChatConditionInput
  $input: DeleteChatInput!
) {
  deleteChat(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteChatMutationVariables,
  APITypes.DeleteChatMutation
>;
export const deleteLoanHandoff = /* GraphQL */ `mutation DeleteLoanHandoff(
  $condition: ModelLoanHandoffConditionInput
  $input: DeleteLoanHandoffInput!
) {
  deleteLoanHandoff(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteLoanHandoffMutationVariables,
  APITypes.DeleteLoanHandoffMutation
>;
export const deleteLoanRequest = /* GraphQL */ `mutation DeleteLoanRequest(
  $condition: ModelLoanRequestConditionInput
  $input: DeleteLoanRequestInput!
) {
  deleteLoanRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteLoanRequestMutationVariables,
  APITypes.DeleteLoanRequestMutation
>;
export const deleteMessage = /* GraphQL */ `mutation DeleteMessage(
  $condition: ModelMessageConditionInput
  $input: DeleteMessageInput!
) {
  deleteMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMessageMutationVariables,
  APITypes.DeleteMessageMutation
>;
export const deleteNotification = /* GraphQL */ `mutation DeleteNotification(
  $condition: ModelNotificationConditionInput
  $input: DeleteNotificationInput!
) {
  deleteNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteNotificationMutationVariables,
  APITypes.DeleteNotificationMutation
>;
export const deletePublicProfile = /* GraphQL */ `mutation DeletePublicProfile(
  $condition: ModelPublicProfileConditionInput
  $input: DeletePublicProfileInput!
) {
  deletePublicProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePublicProfileMutationVariables,
  APITypes.DeletePublicProfileMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const updateActiveLoan = /* GraphQL */ `mutation UpdateActiveLoan(
  $condition: ModelActiveLoanConditionInput
  $input: UpdateActiveLoanInput!
) {
  updateActiveLoan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateActiveLoanMutationVariables,
  APITypes.UpdateActiveLoanMutation
>;
export const updateBook = /* GraphQL */ `mutation UpdateBook(
  $condition: ModelBookConditionInput
  $input: UpdateBookInput!
) {
  updateBook(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBookMutationVariables,
  APITypes.UpdateBookMutation
>;
export const updateChat = /* GraphQL */ `mutation UpdateChat(
  $condition: ModelChatConditionInput
  $input: UpdateChatInput!
) {
  updateChat(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateChatMutationVariables,
  APITypes.UpdateChatMutation
>;
export const updateLoanHandoff = /* GraphQL */ `mutation UpdateLoanHandoff(
  $condition: ModelLoanHandoffConditionInput
  $input: UpdateLoanHandoffInput!
) {
  updateLoanHandoff(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateLoanHandoffMutationVariables,
  APITypes.UpdateLoanHandoffMutation
>;
export const updateLoanRequest = /* GraphQL */ `mutation UpdateLoanRequest(
  $condition: ModelLoanRequestConditionInput
  $input: UpdateLoanRequestInput!
) {
  updateLoanRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateLoanRequestMutationVariables,
  APITypes.UpdateLoanRequestMutation
>;
export const updateMessage = /* GraphQL */ `mutation UpdateMessage(
  $condition: ModelMessageConditionInput
  $input: UpdateMessageInput!
) {
  updateMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMessageMutationVariables,
  APITypes.UpdateMessageMutation
>;
export const updateNotification = /* GraphQL */ `mutation UpdateNotification(
  $condition: ModelNotificationConditionInput
  $input: UpdateNotificationInput!
) {
  updateNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateNotificationMutationVariables,
  APITypes.UpdateNotificationMutation
>;
export const updatePublicProfile = /* GraphQL */ `mutation UpdatePublicProfile(
  $condition: ModelPublicProfileConditionInput
  $input: UpdatePublicProfileInput!
) {
  updatePublicProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePublicProfileMutationVariables,
  APITypes.UpdatePublicProfileMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
