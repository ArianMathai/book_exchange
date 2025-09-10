/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getActiveLoan = /* GraphQL */ `query GetActiveLoan($id: ID!) {
  getActiveLoan(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetActiveLoanQueryVariables,
  APITypes.GetActiveLoanQuery
>;
export const getBook = /* GraphQL */ `query GetBook($id: ID!) {
  getBook(id: $id) {
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
` as GeneratedQuery<APITypes.GetBookQueryVariables, APITypes.GetBookQuery>;
export const getChatMessage = /* GraphQL */ `query GetChatMessage($id: ID!) {
  getChatMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetChatMessageQueryVariables,
  APITypes.GetChatMessageQuery
>;
export const getLoanChat = /* GraphQL */ `query GetLoanChat($id: ID!) {
  getLoanChat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanChatQueryVariables,
  APITypes.GetLoanChatQuery
>;
export const getLoanHandoff = /* GraphQL */ `query GetLoanHandoff($id: ID!) {
  getLoanHandoff(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanHandoffQueryVariables,
  APITypes.GetLoanHandoffQuery
>;
export const getLoanRequest = /* GraphQL */ `query GetLoanRequest($id: ID!) {
  getLoanRequest(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanRequestQueryVariables,
  APITypes.GetLoanRequestQuery
>;
export const getNotification = /* GraphQL */ `query GetNotification($id: ID!) {
  getNotification(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetNotificationQueryVariables,
  APITypes.GetNotificationQuery
>;
export const getPlaceDetails = /* GraphQL */ `query GetPlaceDetails($place_id: String!) {
  getPlaceDetails(place_id: $place_id) {
    address
    city
    latitude
    longitude
    postalCode
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlaceDetailsQueryVariables,
  APITypes.GetPlaceDetailsQuery
>;
export const getPublicProfile = /* GraphQL */ `query GetPublicProfile($id: ID!) {
  getPublicProfile(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPublicProfileQueryVariables,
  APITypes.GetPublicProfileQuery
>;
export const getUser = /* GraphQL */ `query GetUser($sub: ID!) {
  getUser(sub: $sub) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listActiveLoans = /* GraphQL */ `query ListActiveLoans(
  $filter: ModelActiveLoanFilterInput
  $limit: Int
  $nextToken: String
) {
  listActiveLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActiveLoansQueryVariables,
  APITypes.ListActiveLoansQuery
>;
export const listBooks = /* GraphQL */ `query ListBooks(
  $filter: ModelBookFilterInput
  $limit: Int
  $nextToken: String
) {
  listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBooksQueryVariables, APITypes.ListBooksQuery>;
export const listChatMessages = /* GraphQL */ `query ListChatMessages(
  $filter: ModelChatMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChatMessagesQueryVariables,
  APITypes.ListChatMessagesQuery
>;
export const listLoanChats = /* GraphQL */ `query ListLoanChats(
  $filter: ModelLoanChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoanChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanChatsQueryVariables,
  APITypes.ListLoanChatsQuery
>;
export const listLoanHandoffs = /* GraphQL */ `query ListLoanHandoffs(
  $filter: ModelLoanHandoffFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoanHandoffs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanHandoffsQueryVariables,
  APITypes.ListLoanHandoffsQuery
>;
export const listLoanRequests = /* GraphQL */ `query ListLoanRequests(
  $filter: ModelLoanRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoanRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanRequestsQueryVariables,
  APITypes.ListLoanRequestsQuery
>;
export const listNotifications = /* GraphQL */ `query ListNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsQueryVariables,
  APITypes.ListNotificationsQuery
>;
export const listPublicProfiles = /* GraphQL */ `query ListPublicProfiles(
  $filter: ModelPublicProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listPublicProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      bio
      createdAt
      email
      id
      updatedAt
      userId
      username
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPublicProfilesQueryVariables,
  APITypes.ListPublicProfilesQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $sub: ID
) {
  listUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    sub: $sub
  ) {
    items {
      address
      city
      createdAt
      email
      owner
      postalCode
      sub
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const reverseGeocode = /* GraphQL */ `query ReverseGeocode($lat: Float!, $lng: Float!) {
  reverseGeocode(lat: $lat, lng: $lng) {
    address
    city
    latitude
    longitude
    postalCode
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ReverseGeocodeQueryVariables,
  APITypes.ReverseGeocodeQuery
>;
export const searchAddresses = /* GraphQL */ `query SearchAddresses($input: String!, $types: [String]) {
  searchAddresses(input: $input, types: $types) {
    suggestions {
      description
      place_id
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchAddressesQueryVariables,
  APITypes.SearchAddressesQuery
>;
