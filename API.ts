/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ActiveLoan = {
  __typename: "ActiveLoan",
  borrowedBookId: string,
  createdAt: string,
  currentBorrowerId: string,
  dueDate?: string | null,
  id: string,
  isOverdue?: boolean | null,
  loanRequestId: string,
  originalBookId: string,
  originalOwnerId: string,
  overdueNotificationsSent?: number | null,
  owner?: string | null,
  startDate: string,
  updatedAt: string,
};

export type Book = {
  __typename: "Book",
  activeLoanId?: string | null,
  author: string,
  borrowStatus?: BookBorrowStatus | null,
  borrowedAt?: string | null,
  borrowerNotes?: string | null,
  borrowerRating?: number | null,
  createdAt: string,
  dueDate?: string | null,
  id: string,
  imageSource?: string | null,
  imageUrl?: string | null,
  isOriginalCopy?: boolean | null,
  isbn?: string | null,
  loanedOut: boolean,
  loanedTo?: string | null,
  originalBookId?: string | null,
  originalOwnerEmail?: string | null,
  originalOwnerId?: string | null,
  owner?: string | null,
  ownerEmail: string,
  ownerId: string,
  returnedAt?: string | null,
  title: string,
  updatedAt: string,
  wouldRecommend?: boolean | null,
};

export enum BookBorrowStatus {
  active = "active",
  overdue = "overdue",
  returned = "returned",
}


export type Chat = {
  __typename: "Chat",
  borrowerEmail: string,
  borrowerId: string,
  borrowerUnreadCount?: number | null,
  borrowerUsername?: string | null,
  createdAt: string,
  id: string,
  lastMessageAt?: string | null,
  lastMessagePreview?: string | null,
  lenderEmail: string,
  lenderId: string,
  lenderUnreadCount?: number | null,
  lenderUsername?: string | null,
  loanRequest?: LoanRequest | null,
  loanRequestId: string,
  messages?: ModelMessageConnection | null,
  updatedAt: string,
};

export type LoanRequest = {
  __typename: "LoanRequest",
  approvedDuration?: number | null,
  bookId: string,
  chat?: Chat | null,
  completedAt?: string | null,
  createdAt: string,
  dueDate?: string | null,
  id: string,
  lenderId: string,
  message?: string | null,
  proposedDuration?: number | null,
  requestedAt: string,
  requesterId: string,
  respondedAt?: string | null,
  status?: LoanRequestStatus | null,
  updatedAt: string,
};

export enum LoanRequestStatus {
  approved = "approved",
  cancelled = "cancelled",
  completed = "completed",
  meeting_arranged = "meeting_arranged",
  pending = "pending",
  rejected = "rejected",
}


export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
};

export type Message = {
  __typename: "Message",
  borrowerId: string,
  chat?: Chat | null,
  chatId: string,
  content: string,
  createdAt: string,
  id: string,
  isRead?: boolean | null,
  lenderId: string,
  messageType?: MessageMessageType | null,
  readAt?: string | null,
  senderEmail: string,
  senderId: string,
  senderUsername: string,
  updatedAt: string,
};

export enum MessageMessageType {
  system = "system",
  text = "text",
}


export type LoanHandoff = {
  __typename: "LoanHandoff",
  borrowerConfirmed?: boolean | null,
  borrowerConfirmedAt?: string | null,
  completedAt?: string | null,
  createdAt: string,
  id: string,
  lenderConfirmed?: boolean | null,
  lenderConfirmedAt?: string | null,
  lenderId: string,
  loanRequestId: string,
  meetingLocation?: string | null,
  requesterId: string,
  scheduledTime?: string | null,
  updatedAt: string,
};

export type Notification = {
  __typename: "Notification",
  bookId?: string | null,
  createdAt: string,
  handoffId?: string | null,
  id: string,
  isRead?: boolean | null,
  loanRequestId?: string | null,
  message: string,
  title: string,
  type?: NotificationType | null,
  updatedAt: string,
  userId: string,
};

export enum NotificationType {
  book_overdue = "book_overdue",
  book_returned = "book_returned",
  handoff_ready = "handoff_ready",
  loan_approved = "loan_approved",
  loan_rejected = "loan_rejected",
  loan_request = "loan_request",
}


export type AddressDetails = {
  __typename: "AddressDetails",
  address: string,
  city: string,
  latitude?: number | null,
  longitude?: number | null,
  postalCode: string,
};

export type PublicProfile = {
  __typename: "PublicProfile",
  bio?: string | null,
  createdAt: string,
  email: string,
  id: string,
  updatedAt: string,
  userId: string,
  username: string,
};

export type User = {
  __typename: "User",
  address?: string | null,
  city?: string | null,
  coordinates?: UserCoordinates | null,
  createdAt: string,
  email: string,
  owner?: string | null,
  postalCode?: string | null,
  sub: string,
  updatedAt: string,
};

export type UserCoordinates = {
  __typename: "UserCoordinates",
  lat: number,
  long: number,
};

export type ModelActiveLoanFilterInput = {
  and?: Array< ModelActiveLoanFilterInput | null > | null,
  borrowedBookId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  currentBorrowerId?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isOverdue?: ModelBooleanInput | null,
  loanRequestId?: ModelStringInput | null,
  not?: ModelActiveLoanFilterInput | null,
  or?: Array< ModelActiveLoanFilterInput | null > | null,
  originalBookId?: ModelStringInput | null,
  originalOwnerId?: ModelStringInput | null,
  overdueNotificationsSent?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelActiveLoanConnection = {
  __typename: "ModelActiveLoanConnection",
  items:  Array<ActiveLoan | null >,
  nextToken?: string | null,
};

export type ModelBookFilterInput = {
  activeLoanId?: ModelStringInput | null,
  and?: Array< ModelBookFilterInput | null > | null,
  author?: ModelStringInput | null,
  borrowStatus?: ModelBookBorrowStatusInput | null,
  borrowedAt?: ModelStringInput | null,
  borrowerNotes?: ModelStringInput | null,
  borrowerRating?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  imageSource?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  isOriginalCopy?: ModelBooleanInput | null,
  isbn?: ModelStringInput | null,
  loanedOut?: ModelBooleanInput | null,
  loanedTo?: ModelStringInput | null,
  not?: ModelBookFilterInput | null,
  or?: Array< ModelBookFilterInput | null > | null,
  originalBookId?: ModelStringInput | null,
  originalOwnerEmail?: ModelStringInput | null,
  originalOwnerId?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  ownerEmail?: ModelStringInput | null,
  ownerId?: ModelStringInput | null,
  returnedAt?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  wouldRecommend?: ModelBooleanInput | null,
};

export type ModelBookBorrowStatusInput = {
  eq?: BookBorrowStatus | null,
  ne?: BookBorrowStatus | null,
};

export type ModelBookConnection = {
  __typename: "ModelBookConnection",
  items:  Array<Book | null >,
  nextToken?: string | null,
};

export type ModelChatFilterInput = {
  and?: Array< ModelChatFilterInput | null > | null,
  borrowerEmail?: ModelStringInput | null,
  borrowerId?: ModelStringInput | null,
  borrowerUnreadCount?: ModelIntInput | null,
  borrowerUsername?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  lastMessageAt?: ModelStringInput | null,
  lastMessagePreview?: ModelStringInput | null,
  lenderEmail?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  lenderUnreadCount?: ModelIntInput | null,
  lenderUsername?: ModelStringInput | null,
  loanRequestId?: ModelIDInput | null,
  not?: ModelChatFilterInput | null,
  or?: Array< ModelChatFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelChatConnection = {
  __typename: "ModelChatConnection",
  items:  Array<Chat | null >,
  nextToken?: string | null,
};

export type ModelLoanHandoffFilterInput = {
  and?: Array< ModelLoanHandoffFilterInput | null > | null,
  borrowerConfirmed?: ModelBooleanInput | null,
  borrowerConfirmedAt?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  lenderConfirmed?: ModelBooleanInput | null,
  lenderConfirmedAt?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  loanRequestId?: ModelStringInput | null,
  meetingLocation?: ModelStringInput | null,
  not?: ModelLoanHandoffFilterInput | null,
  or?: Array< ModelLoanHandoffFilterInput | null > | null,
  requesterId?: ModelStringInput | null,
  scheduledTime?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLoanHandoffConnection = {
  __typename: "ModelLoanHandoffConnection",
  items:  Array<LoanHandoff | null >,
  nextToken?: string | null,
};

export type ModelLoanRequestFilterInput = {
  and?: Array< ModelLoanRequestFilterInput | null > | null,
  approvedDuration?: ModelIntInput | null,
  bookId?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  lenderId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  not?: ModelLoanRequestFilterInput | null,
  or?: Array< ModelLoanRequestFilterInput | null > | null,
  proposedDuration?: ModelIntInput | null,
  requestedAt?: ModelStringInput | null,
  requesterId?: ModelStringInput | null,
  respondedAt?: ModelStringInput | null,
  status?: ModelLoanRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLoanRequestStatusInput = {
  eq?: LoanRequestStatus | null,
  ne?: LoanRequestStatus | null,
};

export type ModelLoanRequestConnection = {
  __typename: "ModelLoanRequestConnection",
  items:  Array<LoanRequest | null >,
  nextToken?: string | null,
};

export type ModelMessageFilterInput = {
  and?: Array< ModelMessageFilterInput | null > | null,
  borrowerId?: ModelStringInput | null,
  chatId?: ModelIDInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isRead?: ModelBooleanInput | null,
  lenderId?: ModelStringInput | null,
  messageType?: ModelMessageMessageTypeInput | null,
  not?: ModelMessageFilterInput | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  readAt?: ModelStringInput | null,
  senderEmail?: ModelStringInput | null,
  senderId?: ModelStringInput | null,
  senderUsername?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMessageMessageTypeInput = {
  eq?: MessageMessageType | null,
  ne?: MessageMessageType | null,
};

export type ModelNotificationFilterInput = {
  and?: Array< ModelNotificationFilterInput | null > | null,
  bookId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  handoffId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isRead?: ModelBooleanInput | null,
  loanRequestId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  not?: ModelNotificationFilterInput | null,
  or?: Array< ModelNotificationFilterInput | null > | null,
  title?: ModelStringInput | null,
  type?: ModelNotificationTypeInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelNotificationTypeInput = {
  eq?: NotificationType | null,
  ne?: NotificationType | null,
};

export type ModelNotificationConnection = {
  __typename: "ModelNotificationConnection",
  items:  Array<Notification | null >,
  nextToken?: string | null,
};

export type ModelPublicProfileFilterInput = {
  and?: Array< ModelPublicProfileFilterInput | null > | null,
  bio?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPublicProfileFilterInput | null,
  or?: Array< ModelPublicProfileFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
};

export type ModelPublicProfileConnection = {
  __typename: "ModelPublicProfileConnection",
  items:  Array<PublicProfile | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  city?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  sub?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type AddressSearchResult = {
  __typename: "AddressSearchResult",
  suggestions:  Array<AddressSuggestion | null >,
};

export type AddressSuggestion = {
  __typename: "AddressSuggestion",
  description: string,
  place_id: string,
};

export type ApproveLoanRequestMutationReturnType = {
  __typename: "ApproveLoanRequestMutationReturnType",
  chatId?: string | null,
  error?: string | null,
  loanRequestId?: string | null,
  message: string,
  success: boolean,
};

export type ModelActiveLoanConditionInput = {
  and?: Array< ModelActiveLoanConditionInput | null > | null,
  borrowedBookId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  currentBorrowerId?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  isOverdue?: ModelBooleanInput | null,
  loanRequestId?: ModelStringInput | null,
  not?: ModelActiveLoanConditionInput | null,
  or?: Array< ModelActiveLoanConditionInput | null > | null,
  originalBookId?: ModelStringInput | null,
  originalOwnerId?: ModelStringInput | null,
  overdueNotificationsSent?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateActiveLoanInput = {
  borrowedBookId: string,
  currentBorrowerId: string,
  dueDate?: string | null,
  id?: string | null,
  isOverdue?: boolean | null,
  loanRequestId: string,
  originalBookId: string,
  originalOwnerId: string,
  overdueNotificationsSent?: number | null,
  startDate: string,
};

export type ModelBookConditionInput = {
  activeLoanId?: ModelStringInput | null,
  and?: Array< ModelBookConditionInput | null > | null,
  author?: ModelStringInput | null,
  borrowStatus?: ModelBookBorrowStatusInput | null,
  borrowedAt?: ModelStringInput | null,
  borrowerNotes?: ModelStringInput | null,
  borrowerRating?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  imageSource?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  isOriginalCopy?: ModelBooleanInput | null,
  isbn?: ModelStringInput | null,
  loanedOut?: ModelBooleanInput | null,
  loanedTo?: ModelStringInput | null,
  not?: ModelBookConditionInput | null,
  or?: Array< ModelBookConditionInput | null > | null,
  originalBookId?: ModelStringInput | null,
  originalOwnerEmail?: ModelStringInput | null,
  originalOwnerId?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  ownerEmail?: ModelStringInput | null,
  ownerId?: ModelStringInput | null,
  returnedAt?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  wouldRecommend?: ModelBooleanInput | null,
};

export type CreateBookInput = {
  activeLoanId?: string | null,
  author: string,
  borrowStatus?: BookBorrowStatus | null,
  borrowedAt?: string | null,
  borrowerNotes?: string | null,
  borrowerRating?: number | null,
  dueDate?: string | null,
  id?: string | null,
  imageSource?: string | null,
  imageUrl?: string | null,
  isOriginalCopy?: boolean | null,
  isbn?: string | null,
  loanedOut: boolean,
  loanedTo?: string | null,
  originalBookId?: string | null,
  originalOwnerEmail?: string | null,
  originalOwnerId?: string | null,
  ownerEmail: string,
  ownerId: string,
  returnedAt?: string | null,
  title: string,
  wouldRecommend?: boolean | null,
};

export type ModelChatConditionInput = {
  and?: Array< ModelChatConditionInput | null > | null,
  borrowerEmail?: ModelStringInput | null,
  borrowerId?: ModelStringInput | null,
  borrowerUnreadCount?: ModelIntInput | null,
  borrowerUsername?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  lastMessageAt?: ModelStringInput | null,
  lastMessagePreview?: ModelStringInput | null,
  lenderEmail?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  lenderUnreadCount?: ModelIntInput | null,
  lenderUsername?: ModelStringInput | null,
  loanRequestId?: ModelIDInput | null,
  not?: ModelChatConditionInput | null,
  or?: Array< ModelChatConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateChatInput = {
  borrowerEmail: string,
  borrowerId: string,
  borrowerUnreadCount?: number | null,
  borrowerUsername?: string | null,
  id?: string | null,
  lastMessageAt?: string | null,
  lastMessagePreview?: string | null,
  lenderEmail: string,
  lenderId: string,
  lenderUnreadCount?: number | null,
  lenderUsername?: string | null,
  loanRequestId: string,
};

export type ModelLoanHandoffConditionInput = {
  and?: Array< ModelLoanHandoffConditionInput | null > | null,
  borrowerConfirmed?: ModelBooleanInput | null,
  borrowerConfirmedAt?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  lenderConfirmed?: ModelBooleanInput | null,
  lenderConfirmedAt?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  loanRequestId?: ModelStringInput | null,
  meetingLocation?: ModelStringInput | null,
  not?: ModelLoanHandoffConditionInput | null,
  or?: Array< ModelLoanHandoffConditionInput | null > | null,
  requesterId?: ModelStringInput | null,
  scheduledTime?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLoanHandoffInput = {
  borrowerConfirmed?: boolean | null,
  borrowerConfirmedAt?: string | null,
  completedAt?: string | null,
  id?: string | null,
  lenderConfirmed?: boolean | null,
  lenderConfirmedAt?: string | null,
  lenderId: string,
  loanRequestId: string,
  meetingLocation?: string | null,
  requesterId: string,
  scheduledTime?: string | null,
};

export type ModelLoanRequestConditionInput = {
  and?: Array< ModelLoanRequestConditionInput | null > | null,
  approvedDuration?: ModelIntInput | null,
  bookId?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  not?: ModelLoanRequestConditionInput | null,
  or?: Array< ModelLoanRequestConditionInput | null > | null,
  proposedDuration?: ModelIntInput | null,
  requestedAt?: ModelStringInput | null,
  requesterId?: ModelStringInput | null,
  respondedAt?: ModelStringInput | null,
  status?: ModelLoanRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLoanRequestInput = {
  approvedDuration?: number | null,
  bookId: string,
  completedAt?: string | null,
  dueDate?: string | null,
  id?: string | null,
  lenderId: string,
  message?: string | null,
  proposedDuration?: number | null,
  requestedAt: string,
  requesterId: string,
  respondedAt?: string | null,
  status?: LoanRequestStatus | null,
};

export type ModelMessageConditionInput = {
  and?: Array< ModelMessageConditionInput | null > | null,
  borrowerId?: ModelStringInput | null,
  chatId?: ModelIDInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  isRead?: ModelBooleanInput | null,
  lenderId?: ModelStringInput | null,
  messageType?: ModelMessageMessageTypeInput | null,
  not?: ModelMessageConditionInput | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  readAt?: ModelStringInput | null,
  senderEmail?: ModelStringInput | null,
  senderId?: ModelStringInput | null,
  senderUsername?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMessageInput = {
  borrowerId: string,
  chatId: string,
  content: string,
  id?: string | null,
  isRead?: boolean | null,
  lenderId: string,
  messageType?: MessageMessageType | null,
  readAt?: string | null,
  senderEmail: string,
  senderId: string,
  senderUsername: string,
};

export type ModelNotificationConditionInput = {
  and?: Array< ModelNotificationConditionInput | null > | null,
  bookId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  handoffId?: ModelStringInput | null,
  isRead?: ModelBooleanInput | null,
  loanRequestId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  not?: ModelNotificationConditionInput | null,
  or?: Array< ModelNotificationConditionInput | null > | null,
  title?: ModelStringInput | null,
  type?: ModelNotificationTypeInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateNotificationInput = {
  bookId?: string | null,
  handoffId?: string | null,
  id?: string | null,
  isRead?: boolean | null,
  loanRequestId?: string | null,
  message: string,
  title: string,
  type?: NotificationType | null,
  userId: string,
};

export type ModelPublicProfileConditionInput = {
  and?: Array< ModelPublicProfileConditionInput | null > | null,
  bio?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  not?: ModelPublicProfileConditionInput | null,
  or?: Array< ModelPublicProfileConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
};

export type CreatePublicProfileInput = {
  bio?: string | null,
  email: string,
  id?: string | null,
  userId: string,
  username: string,
};

export type ModelUserConditionInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  city?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  owner?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  address?: string | null,
  city?: string | null,
  coordinates?: UserCoordinatesInput | null,
  email: string,
  postalCode?: string | null,
  sub: string,
};

export type UserCoordinatesInput = {
  lat: number,
  long: number,
};

export type DeleteActiveLoanInput = {
  id: string,
};

export type DeleteBookInput = {
  id: string,
};

export type DeleteChatInput = {
  id: string,
};

export type DeleteLoanHandoffInput = {
  id: string,
};

export type DeleteLoanRequestInput = {
  id: string,
};

export type DeleteMessageInput = {
  id: string,
};

export type DeleteNotificationInput = {
  id: string,
};

export type DeletePublicProfileInput = {
  id: string,
};

export type DeleteUserInput = {
  sub: string,
};

export type UpdateActiveLoanInput = {
  borrowedBookId?: string | null,
  currentBorrowerId?: string | null,
  dueDate?: string | null,
  id: string,
  isOverdue?: boolean | null,
  loanRequestId?: string | null,
  originalBookId?: string | null,
  originalOwnerId?: string | null,
  overdueNotificationsSent?: number | null,
  startDate?: string | null,
};

export type UpdateBookInput = {
  activeLoanId?: string | null,
  author?: string | null,
  borrowStatus?: BookBorrowStatus | null,
  borrowedAt?: string | null,
  borrowerNotes?: string | null,
  borrowerRating?: number | null,
  dueDate?: string | null,
  id: string,
  imageSource?: string | null,
  imageUrl?: string | null,
  isOriginalCopy?: boolean | null,
  isbn?: string | null,
  loanedOut?: boolean | null,
  loanedTo?: string | null,
  originalBookId?: string | null,
  originalOwnerEmail?: string | null,
  originalOwnerId?: string | null,
  ownerEmail?: string | null,
  ownerId?: string | null,
  returnedAt?: string | null,
  title?: string | null,
  wouldRecommend?: boolean | null,
};

export type UpdateChatInput = {
  borrowerEmail?: string | null,
  borrowerId?: string | null,
  borrowerUnreadCount?: number | null,
  borrowerUsername?: string | null,
  id: string,
  lastMessageAt?: string | null,
  lastMessagePreview?: string | null,
  lenderEmail?: string | null,
  lenderId?: string | null,
  lenderUnreadCount?: number | null,
  lenderUsername?: string | null,
  loanRequestId?: string | null,
};

export type UpdateLoanHandoffInput = {
  borrowerConfirmed?: boolean | null,
  borrowerConfirmedAt?: string | null,
  completedAt?: string | null,
  id: string,
  lenderConfirmed?: boolean | null,
  lenderConfirmedAt?: string | null,
  lenderId?: string | null,
  loanRequestId?: string | null,
  meetingLocation?: string | null,
  requesterId?: string | null,
  scheduledTime?: string | null,
};

export type UpdateLoanRequestInput = {
  approvedDuration?: number | null,
  bookId?: string | null,
  completedAt?: string | null,
  dueDate?: string | null,
  id: string,
  lenderId?: string | null,
  message?: string | null,
  proposedDuration?: number | null,
  requestedAt?: string | null,
  requesterId?: string | null,
  respondedAt?: string | null,
  status?: LoanRequestStatus | null,
};

export type UpdateMessageInput = {
  borrowerId?: string | null,
  chatId?: string | null,
  content?: string | null,
  id: string,
  isRead?: boolean | null,
  lenderId?: string | null,
  messageType?: MessageMessageType | null,
  readAt?: string | null,
  senderEmail?: string | null,
  senderId?: string | null,
  senderUsername?: string | null,
};

export type UpdateNotificationInput = {
  bookId?: string | null,
  handoffId?: string | null,
  id: string,
  isRead?: boolean | null,
  loanRequestId?: string | null,
  message?: string | null,
  title?: string | null,
  type?: NotificationType | null,
  userId?: string | null,
};

export type UpdatePublicProfileInput = {
  bio?: string | null,
  email?: string | null,
  id: string,
  userId?: string | null,
  username?: string | null,
};

export type UpdateUserInput = {
  address?: string | null,
  city?: string | null,
  coordinates?: UserCoordinatesInput | null,
  email?: string | null,
  postalCode?: string | null,
  sub: string,
};

export type ModelSubscriptionActiveLoanFilterInput = {
  and?: Array< ModelSubscriptionActiveLoanFilterInput | null > | null,
  borrowedBookId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  currentBorrowerId?: ModelSubscriptionStringInput | null,
  dueDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isOverdue?: ModelSubscriptionBooleanInput | null,
  loanRequestId?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionActiveLoanFilterInput | null > | null,
  originalBookId?: ModelSubscriptionStringInput | null,
  originalOwnerId?: ModelSubscriptionStringInput | null,
  overdueNotificationsSent?: ModelSubscriptionIntInput | null,
  owner?: ModelStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBookFilterInput = {
  activeLoanId?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBookFilterInput | null > | null,
  author?: ModelSubscriptionStringInput | null,
  borrowStatus?: ModelSubscriptionStringInput | null,
  borrowedAt?: ModelSubscriptionStringInput | null,
  borrowerNotes?: ModelSubscriptionStringInput | null,
  borrowerRating?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dueDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageSource?: ModelSubscriptionStringInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  isOriginalCopy?: ModelSubscriptionBooleanInput | null,
  isbn?: ModelSubscriptionStringInput | null,
  loanedOut?: ModelSubscriptionBooleanInput | null,
  loanedTo?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionBookFilterInput | null > | null,
  originalBookId?: ModelSubscriptionStringInput | null,
  originalOwnerEmail?: ModelSubscriptionStringInput | null,
  originalOwnerId?: ModelSubscriptionStringInput | null,
  owner?: ModelStringInput | null,
  ownerEmail?: ModelSubscriptionStringInput | null,
  ownerId?: ModelSubscriptionStringInput | null,
  returnedAt?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  wouldRecommend?: ModelSubscriptionBooleanInput | null,
};

export type ModelSubscriptionChatFilterInput = {
  and?: Array< ModelSubscriptionChatFilterInput | null > | null,
  borrowerEmail?: ModelSubscriptionStringInput | null,
  borrowerId?: ModelStringInput | null,
  borrowerUnreadCount?: ModelSubscriptionIntInput | null,
  borrowerUsername?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  lastMessageAt?: ModelSubscriptionStringInput | null,
  lastMessagePreview?: ModelSubscriptionStringInput | null,
  lenderEmail?: ModelSubscriptionStringInput | null,
  lenderId?: ModelStringInput | null,
  lenderUnreadCount?: ModelSubscriptionIntInput | null,
  lenderUsername?: ModelSubscriptionStringInput | null,
  loanRequestId?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionChatFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionLoanHandoffFilterInput = {
  and?: Array< ModelSubscriptionLoanHandoffFilterInput | null > | null,
  borrowerConfirmed?: ModelSubscriptionBooleanInput | null,
  borrowerConfirmedAt?: ModelSubscriptionStringInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  lenderConfirmed?: ModelSubscriptionBooleanInput | null,
  lenderConfirmedAt?: ModelSubscriptionStringInput | null,
  lenderId?: ModelStringInput | null,
  loanRequestId?: ModelSubscriptionStringInput | null,
  meetingLocation?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLoanHandoffFilterInput | null > | null,
  requesterId?: ModelStringInput | null,
  scheduledTime?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionLoanRequestFilterInput = {
  and?: Array< ModelSubscriptionLoanRequestFilterInput | null > | null,
  approvedDuration?: ModelSubscriptionIntInput | null,
  bookId?: ModelSubscriptionStringInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dueDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  lenderId?: ModelStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLoanRequestFilterInput | null > | null,
  proposedDuration?: ModelSubscriptionIntInput | null,
  requestedAt?: ModelSubscriptionStringInput | null,
  requesterId?: ModelStringInput | null,
  respondedAt?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMessageFilterInput = {
  and?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  borrowerId?: ModelStringInput | null,
  chatId?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isRead?: ModelSubscriptionBooleanInput | null,
  lenderId?: ModelStringInput | null,
  messageType?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  readAt?: ModelSubscriptionStringInput | null,
  senderEmail?: ModelSubscriptionStringInput | null,
  senderId?: ModelStringInput | null,
  senderUsername?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionNotificationFilterInput = {
  and?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  bookId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  handoffId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isRead?: ModelSubscriptionBooleanInput | null,
  loanRequestId?: ModelSubscriptionStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  title?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelSubscriptionPublicProfileFilterInput = {
  and?: Array< ModelSubscriptionPublicProfileFilterInput | null > | null,
  bio?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPublicProfileFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelStringInput | null,
  username?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  address?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  city?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  postalCode?: ModelSubscriptionStringInput | null,
  sub?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetActiveLoanQueryVariables = {
  id: string,
};

export type GetActiveLoanQuery = {
  getActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type GetBookQueryVariables = {
  id: string,
};

export type GetBookQuery = {
  getBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type GetChatQueryVariables = {
  id: string,
};

export type GetChatQuery = {
  getChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetLoanHandoffQueryVariables = {
  id: string,
};

export type GetLoanHandoffQuery = {
  getLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type GetLoanRequestQueryVariables = {
  id: string,
};

export type GetLoanRequestQuery = {
  getLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type GetNotificationQueryVariables = {
  id: string,
};

export type GetNotificationQuery = {
  getNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetPlaceDetailsQueryVariables = {
  place_id: string,
};

export type GetPlaceDetailsQuery = {
  getPlaceDetails:  {
    __typename: "AddressDetails",
    address: string,
    city: string,
    latitude?: number | null,
    longitude?: number | null,
    postalCode: string,
  },
};

export type GetPublicProfileQueryVariables = {
  id: string,
};

export type GetPublicProfileQuery = {
  getPublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type GetUserQueryVariables = {
  sub: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type ListActiveLoansQueryVariables = {
  filter?: ModelActiveLoanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActiveLoansQuery = {
  listActiveLoans?:  {
    __typename: "ModelActiveLoanConnection",
    items:  Array< {
      __typename: "ActiveLoan",
      borrowedBookId: string,
      createdAt: string,
      currentBorrowerId: string,
      dueDate?: string | null,
      id: string,
      isOverdue?: boolean | null,
      loanRequestId: string,
      originalBookId: string,
      originalOwnerId: string,
      overdueNotificationsSent?: number | null,
      owner?: string | null,
      startDate: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBooksQueryVariables = {
  filter?: ModelBookFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBooksQuery = {
  listBooks?:  {
    __typename: "ModelBookConnection",
    items:  Array< {
      __typename: "Book",
      activeLoanId?: string | null,
      author: string,
      borrowStatus?: BookBorrowStatus | null,
      borrowedAt?: string | null,
      borrowerNotes?: string | null,
      borrowerRating?: number | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      imageSource?: string | null,
      imageUrl?: string | null,
      isOriginalCopy?: boolean | null,
      isbn?: string | null,
      loanedOut: boolean,
      loanedTo?: string | null,
      originalBookId?: string | null,
      originalOwnerEmail?: string | null,
      originalOwnerId?: string | null,
      owner?: string | null,
      ownerEmail: string,
      ownerId: string,
      returnedAt?: string | null,
      title: string,
      updatedAt: string,
      wouldRecommend?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListChatsQueryVariables = {
  filter?: ModelChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChatsQuery = {
  listChats?:  {
    __typename: "ModelChatConnection",
    items:  Array< {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLoanHandoffsQueryVariables = {
  filter?: ModelLoanHandoffFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLoanHandoffsQuery = {
  listLoanHandoffs?:  {
    __typename: "ModelLoanHandoffConnection",
    items:  Array< {
      __typename: "LoanHandoff",
      borrowerConfirmed?: boolean | null,
      borrowerConfirmedAt?: string | null,
      completedAt?: string | null,
      createdAt: string,
      id: string,
      lenderConfirmed?: boolean | null,
      lenderConfirmedAt?: string | null,
      lenderId: string,
      loanRequestId: string,
      meetingLocation?: string | null,
      requesterId: string,
      scheduledTime?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLoanRequestsQueryVariables = {
  filter?: ModelLoanRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLoanRequestsQuery = {
  listLoanRequests?:  {
    __typename: "ModelLoanRequestConnection",
    items:  Array< {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      borrowerId: string,
      chatId: string,
      content: string,
      createdAt: string,
      id: string,
      isRead?: boolean | null,
      lenderId: string,
      messageType?: MessageMessageType | null,
      readAt?: string | null,
      senderEmail: string,
      senderId: string,
      senderUsername: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNotificationsQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotificationsQuery = {
  listNotifications?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      bookId?: string | null,
      createdAt: string,
      handoffId?: string | null,
      id: string,
      isRead?: boolean | null,
      loanRequestId?: string | null,
      message: string,
      title: string,
      type?: NotificationType | null,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPublicProfilesQueryVariables = {
  filter?: ModelPublicProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPublicProfilesQuery = {
  listPublicProfiles?:  {
    __typename: "ModelPublicProfileConnection",
    items:  Array< {
      __typename: "PublicProfile",
      bio?: string | null,
      createdAt: string,
      email: string,
      id: string,
      updatedAt: string,
      userId: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  sub?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      city?: string | null,
      createdAt: string,
      email: string,
      owner?: string | null,
      postalCode?: string | null,
      sub: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ReverseGeocodeQueryVariables = {
  lat: number,
  lng: number,
};

export type ReverseGeocodeQuery = {
  reverseGeocode?:  {
    __typename: "AddressDetails",
    address: string,
    city: string,
    latitude?: number | null,
    longitude?: number | null,
    postalCode: string,
  } | null,
};

export type SearchAddressesQueryVariables = {
  input: string,
  types?: Array< string | null > | null,
};

export type SearchAddressesQuery = {
  searchAddresses?:  {
    __typename: "AddressSearchResult",
    suggestions:  Array< {
      __typename: "AddressSuggestion",
      description: string,
      place_id: string,
    } | null >,
  } | null,
};

export type ApproveLoanRequestMutationMutationVariables = {
  approvedDuration: number,
  loanRequestId: string,
  userName: string,
};

export type ApproveLoanRequestMutationMutation = {
  approveLoanRequestMutation?:  {
    __typename: "ApproveLoanRequestMutationReturnType",
    chatId?: string | null,
    error?: string | null,
    loanRequestId?: string | null,
    message: string,
    success: boolean,
  } | null,
};

export type CreateActiveLoanMutationVariables = {
  condition?: ModelActiveLoanConditionInput | null,
  input: CreateActiveLoanInput,
};

export type CreateActiveLoanMutation = {
  createActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type CreateBookMutationVariables = {
  condition?: ModelBookConditionInput | null,
  input: CreateBookInput,
};

export type CreateBookMutation = {
  createBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type CreateChatMutationVariables = {
  condition?: ModelChatConditionInput | null,
  input: CreateChatInput,
};

export type CreateChatMutation = {
  createChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateLoanHandoffMutationVariables = {
  condition?: ModelLoanHandoffConditionInput | null,
  input: CreateLoanHandoffInput,
};

export type CreateLoanHandoffMutation = {
  createLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateLoanRequestMutationVariables = {
  condition?: ModelLoanRequestConditionInput | null,
  input: CreateLoanRequestInput,
};

export type CreateLoanRequestMutation = {
  createLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type CreateMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null,
  input: CreateMessageInput,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type CreateNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: CreateNotificationInput,
};

export type CreateNotificationMutation = {
  createNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreatePublicProfileMutationVariables = {
  condition?: ModelPublicProfileConditionInput | null,
  input: CreatePublicProfileInput,
};

export type CreatePublicProfileMutation = {
  createPublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type DeleteActiveLoanMutationVariables = {
  condition?: ModelActiveLoanConditionInput | null,
  input: DeleteActiveLoanInput,
};

export type DeleteActiveLoanMutation = {
  deleteActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type DeleteBookMutationVariables = {
  condition?: ModelBookConditionInput | null,
  input: DeleteBookInput,
};

export type DeleteBookMutation = {
  deleteBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type DeleteChatMutationVariables = {
  condition?: ModelChatConditionInput | null,
  input: DeleteChatInput,
};

export type DeleteChatMutation = {
  deleteChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteLoanHandoffMutationVariables = {
  condition?: ModelLoanHandoffConditionInput | null,
  input: DeleteLoanHandoffInput,
};

export type DeleteLoanHandoffMutation = {
  deleteLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteLoanRequestMutationVariables = {
  condition?: ModelLoanRequestConditionInput | null,
  input: DeleteLoanRequestInput,
};

export type DeleteLoanRequestMutation = {
  deleteLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null,
  input: DeleteMessageInput,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type DeleteNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: DeleteNotificationInput,
};

export type DeleteNotificationMutation = {
  deleteNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeletePublicProfileMutationVariables = {
  condition?: ModelPublicProfileConditionInput | null,
  input: DeletePublicProfileInput,
};

export type DeletePublicProfileMutation = {
  deletePublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type UpdateActiveLoanMutationVariables = {
  condition?: ModelActiveLoanConditionInput | null,
  input: UpdateActiveLoanInput,
};

export type UpdateActiveLoanMutation = {
  updateActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type UpdateBookMutationVariables = {
  condition?: ModelBookConditionInput | null,
  input: UpdateBookInput,
};

export type UpdateBookMutation = {
  updateBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type UpdateChatMutationVariables = {
  condition?: ModelChatConditionInput | null,
  input: UpdateChatInput,
};

export type UpdateChatMutation = {
  updateChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateLoanHandoffMutationVariables = {
  condition?: ModelLoanHandoffConditionInput | null,
  input: UpdateLoanHandoffInput,
};

export type UpdateLoanHandoffMutation = {
  updateLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateLoanRequestMutationVariables = {
  condition?: ModelLoanRequestConditionInput | null,
  input: UpdateLoanRequestInput,
};

export type UpdateLoanRequestMutation = {
  updateLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type UpdateMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null,
  input: UpdateMessageInput,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type UpdateNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: UpdateNotificationInput,
};

export type UpdateNotificationMutation = {
  updateNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdatePublicProfileMutationVariables = {
  condition?: ModelPublicProfileConditionInput | null,
  input: UpdatePublicProfileInput,
};

export type UpdatePublicProfileMutation = {
  updatePublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type OnCreateActiveLoanSubscriptionVariables = {
  filter?: ModelSubscriptionActiveLoanFilterInput | null,
  owner?: string | null,
};

export type OnCreateActiveLoanSubscription = {
  onCreateActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
  owner?: string | null,
};

export type OnCreateBookSubscription = {
  onCreateBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type OnCreateChatSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionChatFilterInput | null,
  lenderId?: string | null,
};

export type OnCreateChatSubscription = {
  onCreateChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnCreateLoanHandoffSubscription = {
  onCreateLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnCreateLoanRequestSubscription = {
  onCreateLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionMessageFilterInput | null,
  lenderId?: string | null,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
  userId?: string | null,
};

export type OnCreateNotificationSubscription = {
  onCreateNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreatePublicProfileSubscriptionVariables = {
  filter?: ModelSubscriptionPublicProfileFilterInput | null,
  userId?: string | null,
};

export type OnCreatePublicProfileSubscription = {
  onCreatePublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteActiveLoanSubscriptionVariables = {
  filter?: ModelSubscriptionActiveLoanFilterInput | null,
  owner?: string | null,
};

export type OnDeleteActiveLoanSubscription = {
  onDeleteActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
  owner?: string | null,
};

export type OnDeleteBookSubscription = {
  onDeleteBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type OnDeleteChatSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionChatFilterInput | null,
  lenderId?: string | null,
};

export type OnDeleteChatSubscription = {
  onDeleteChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnDeleteLoanHandoffSubscription = {
  onDeleteLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnDeleteLoanRequestSubscription = {
  onDeleteLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionMessageFilterInput | null,
  lenderId?: string | null,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
  userId?: string | null,
};

export type OnDeleteNotificationSubscription = {
  onDeleteNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeletePublicProfileSubscriptionVariables = {
  filter?: ModelSubscriptionPublicProfileFilterInput | null,
  userId?: string | null,
};

export type OnDeletePublicProfileSubscription = {
  onDeletePublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateActiveLoanSubscriptionVariables = {
  filter?: ModelSubscriptionActiveLoanFilterInput | null,
  owner?: string | null,
};

export type OnUpdateActiveLoanSubscription = {
  onUpdateActiveLoan?:  {
    __typename: "ActiveLoan",
    borrowedBookId: string,
    createdAt: string,
    currentBorrowerId: string,
    dueDate?: string | null,
    id: string,
    isOverdue?: boolean | null,
    loanRequestId: string,
    originalBookId: string,
    originalOwnerId: string,
    overdueNotificationsSent?: number | null,
    owner?: string | null,
    startDate: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
  owner?: string | null,
};

export type OnUpdateBookSubscription = {
  onUpdateBook?:  {
    __typename: "Book",
    activeLoanId?: string | null,
    author: string,
    borrowStatus?: BookBorrowStatus | null,
    borrowedAt?: string | null,
    borrowerNotes?: string | null,
    borrowerRating?: number | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    imageSource?: string | null,
    imageUrl?: string | null,
    isOriginalCopy?: boolean | null,
    isbn?: string | null,
    loanedOut: boolean,
    loanedTo?: string | null,
    originalBookId?: string | null,
    originalOwnerEmail?: string | null,
    originalOwnerId?: string | null,
    owner?: string | null,
    ownerEmail: string,
    ownerId: string,
    returnedAt?: string | null,
    title: string,
    updatedAt: string,
    wouldRecommend?: boolean | null,
  } | null,
};

export type OnUpdateChatSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionChatFilterInput | null,
  lenderId?: string | null,
};

export type OnUpdateChatSubscription = {
  onUpdateChat?:  {
    __typename: "Chat",
    borrowerEmail: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    borrowerUsername?: string | null,
    createdAt: string,
    id: string,
    lastMessageAt?: string | null,
    lastMessagePreview?: string | null,
    lenderEmail: string,
    lenderId: string,
    lenderUnreadCount?: number | null,
    lenderUsername?: string | null,
    loanRequest?:  {
      __typename: "LoanRequest",
      approvedDuration?: number | null,
      bookId: string,
      completedAt?: string | null,
      createdAt: string,
      dueDate?: string | null,
      id: string,
      lenderId: string,
      message?: string | null,
      proposedDuration?: number | null,
      requestedAt: string,
      requesterId: string,
      respondedAt?: string | null,
      status?: LoanRequestStatus | null,
      updatedAt: string,
    } | null,
    loanRequestId: string,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnUpdateLoanHandoffSubscription = {
  onUpdateLoanHandoff?:  {
    __typename: "LoanHandoff",
    borrowerConfirmed?: boolean | null,
    borrowerConfirmedAt?: string | null,
    completedAt?: string | null,
    createdAt: string,
    id: string,
    lenderConfirmed?: boolean | null,
    lenderConfirmedAt?: string | null,
    lenderId: string,
    loanRequestId: string,
    meetingLocation?: string | null,
    requesterId: string,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  lenderId?: string | null,
  requesterId?: string | null,
};

export type OnUpdateLoanRequestSubscription = {
  onUpdateLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessageSubscriptionVariables = {
  borrowerId?: string | null,
  filter?: ModelSubscriptionMessageFilterInput | null,
  lenderId?: string | null,
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?:  {
    __typename: "Message",
    borrowerId: string,
    chat?:  {
      __typename: "Chat",
      borrowerEmail: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      borrowerUsername?: string | null,
      createdAt: string,
      id: string,
      lastMessageAt?: string | null,
      lastMessagePreview?: string | null,
      lenderEmail: string,
      lenderId: string,
      lenderUnreadCount?: number | null,
      lenderUsername?: string | null,
      loanRequestId: string,
      updatedAt: string,
    } | null,
    chatId: string,
    content: string,
    createdAt: string,
    id: string,
    isRead?: boolean | null,
    lenderId: string,
    messageType?: MessageMessageType | null,
    readAt?: string | null,
    senderEmail: string,
    senderId: string,
    senderUsername: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
  userId?: string | null,
};

export type OnUpdateNotificationSubscription = {
  onUpdateNotification?:  {
    __typename: "Notification",
    bookId?: string | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isRead?: boolean | null,
    loanRequestId?: string | null,
    message: string,
    title: string,
    type?: NotificationType | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdatePublicProfileSubscriptionVariables = {
  filter?: ModelSubscriptionPublicProfileFilterInput | null,
  userId?: string | null,
};

export type OnUpdatePublicProfileSubscription = {
  onUpdatePublicProfile?:  {
    __typename: "PublicProfile",
    bio?: string | null,
    createdAt: string,
    email: string,
    id: string,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    address?: string | null,
    city?: string | null,
    coordinates?:  {
      __typename: "UserCoordinates",
      lat: number,
      long: number,
    } | null,
    createdAt: string,
    email: string,
    owner?: string | null,
    postalCode?: string | null,
    sub: string,
    updatedAt: string,
  } | null,
};
