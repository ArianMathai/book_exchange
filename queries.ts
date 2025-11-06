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
` as GeneratedQuery<APITypes.GetBookQueryVariables, APITypes.GetBookQuery>;
export const getChat = /* GraphQL */ `query GetChat($id: ID!) {
  getChat(id: $id) {
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
` as GeneratedQuery<APITypes.GetChatQueryVariables, APITypes.GetChatQuery>;
export const getLoanHandoff = /* GraphQL */ `query GetLoanHandoff($id: ID!) {
  getLoanHandoff(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanHandoffQueryVariables,
  APITypes.GetLoanHandoffQuery
>;
export const getLoanRequest = /* GraphQL */ `query GetLoanRequest($id: ID!) {
  getLoanRequest(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanRequestQueryVariables,
  APITypes.GetLoanRequestQuery
>;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBooksQueryVariables, APITypes.ListBooksQuery>;
export const listChats = /* GraphQL */ `query ListChats(
  $filter: ModelChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListChatsQueryVariables, APITypes.ListChatsQuery>;
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
      lenderId
      loanRequestId
      meetingLocation
      requesterId
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
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      borrowerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
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
