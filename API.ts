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


export type ChatMessage = {
  __typename: "ChatMessage",
  chatId: string,
  content: string,
  createdAt: string,
  editedAt?: string | null,
  id: string,
  isEdited?: boolean | null,
  isRead?: boolean | null,
  isSystemMessage?: boolean | null,
  messageType?: ChatMessageMessageType | null,
  metadata?: string | null,
  readAt?: string | null,
  senderId: string,
  senderRole?: ChatMessageSenderRole | null,
  updatedAt: string,
};

export enum ChatMessageMessageType {
  location_suggestion = "location_suggestion",
  request_extension = "request_extension",
  return_arrangement = "return_arrangement",
  system = "system",
  text = "text",
  time_suggestion = "time_suggestion",
}


export enum ChatMessageSenderRole {
  borrower = "borrower",
  lender = "lender",
}


export type LoanChat = {
  __typename: "LoanChat",
  activeLoanId?: string | null,
  bookId: string,
  borrowerId: string,
  borrowerUnreadCount?: number | null,
  closedAt?: string | null,
  closedReason?: LoanChatClosedReason | null,
  createdAt: string,
  handoffId?: string | null,
  id: string,
  isActive?: boolean | null,
  lastMessageAt?: string | null,
  lenderId: string,
  lenderUnreadCount?: number | null,
  loanRequestId: string,
  stage?: LoanChatStage | null,
  updatedAt: string,
};

export enum LoanChatClosedReason {
  cancelled = "cancelled",
  completed = "completed",
  rejected = "rejected",
}


export enum LoanChatStage {
  active_loan = "active_loan",
  completed = "completed",
  handoff = "handoff",
  request = "request",
  return = "return",
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
  loanRequestId: string,
  meetingLocation?: string | null,
  owner?: string | null,
  scheduledTime?: string | null,
  updatedAt: string,
};

export type LoanRequest = {
  __typename: "LoanRequest",
  approvedDuration?: number | null,
  bookId: string,
  completedAt?: string | null,
  createdAt: string,
  dueDate?: string | null,
  id: string,
  lenderId: string,
  message?: string | null,
  owner?: string | null,
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

export type ModelChatMessageFilterInput = {
  and?: Array< ModelChatMessageFilterInput | null > | null,
  chatId?: ModelStringInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  editedAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isEdited?: ModelBooleanInput | null,
  isRead?: ModelBooleanInput | null,
  isSystemMessage?: ModelBooleanInput | null,
  messageType?: ModelChatMessageMessageTypeInput | null,
  metadata?: ModelStringInput | null,
  not?: ModelChatMessageFilterInput | null,
  or?: Array< ModelChatMessageFilterInput | null > | null,
  readAt?: ModelStringInput | null,
  senderId?: ModelStringInput | null,
  senderRole?: ModelChatMessageSenderRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelChatMessageMessageTypeInput = {
  eq?: ChatMessageMessageType | null,
  ne?: ChatMessageMessageType | null,
};

export type ModelChatMessageSenderRoleInput = {
  eq?: ChatMessageSenderRole | null,
  ne?: ChatMessageSenderRole | null,
};

export type ModelChatMessageConnection = {
  __typename: "ModelChatMessageConnection",
  items:  Array<ChatMessage | null >,
  nextToken?: string | null,
};

export type ModelLoanChatFilterInput = {
  activeLoanId?: ModelStringInput | null,
  and?: Array< ModelLoanChatFilterInput | null > | null,
  bookId?: ModelStringInput | null,
  borrowerId?: ModelStringInput | null,
  borrowerUnreadCount?: ModelIntInput | null,
  closedAt?: ModelStringInput | null,
  closedReason?: ModelLoanChatClosedReasonInput | null,
  createdAt?: ModelStringInput | null,
  handoffId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  lastMessageAt?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  lenderUnreadCount?: ModelIntInput | null,
  loanRequestId?: ModelStringInput | null,
  not?: ModelLoanChatFilterInput | null,
  or?: Array< ModelLoanChatFilterInput | null > | null,
  stage?: ModelLoanChatStageInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLoanChatClosedReasonInput = {
  eq?: LoanChatClosedReason | null,
  ne?: LoanChatClosedReason | null,
};

export type ModelLoanChatStageInput = {
  eq?: LoanChatStage | null,
  ne?: LoanChatStage | null,
};

export type ModelLoanChatConnection = {
  __typename: "ModelLoanChatConnection",
  items:  Array<LoanChat | null >,
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
  loanRequestId?: ModelStringInput | null,
  meetingLocation?: ModelStringInput | null,
  not?: ModelLoanHandoffFilterInput | null,
  or?: Array< ModelLoanHandoffFilterInput | null > | null,
  owner?: ModelStringInput | null,
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
  owner?: ModelStringInput | null,
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

export type ModelChatMessageConditionInput = {
  and?: Array< ModelChatMessageConditionInput | null > | null,
  chatId?: ModelStringInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  editedAt?: ModelStringInput | null,
  isEdited?: ModelBooleanInput | null,
  isRead?: ModelBooleanInput | null,
  isSystemMessage?: ModelBooleanInput | null,
  messageType?: ModelChatMessageMessageTypeInput | null,
  metadata?: ModelStringInput | null,
  not?: ModelChatMessageConditionInput | null,
  or?: Array< ModelChatMessageConditionInput | null > | null,
  readAt?: ModelStringInput | null,
  senderId?: ModelStringInput | null,
  senderRole?: ModelChatMessageSenderRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateChatMessageInput = {
  chatId: string,
  content: string,
  editedAt?: string | null,
  id?: string | null,
  isEdited?: boolean | null,
  isRead?: boolean | null,
  isSystemMessage?: boolean | null,
  messageType?: ChatMessageMessageType | null,
  metadata?: string | null,
  readAt?: string | null,
  senderId: string,
  senderRole?: ChatMessageSenderRole | null,
};

export type ModelLoanChatConditionInput = {
  activeLoanId?: ModelStringInput | null,
  and?: Array< ModelLoanChatConditionInput | null > | null,
  bookId?: ModelStringInput | null,
  borrowerId?: ModelStringInput | null,
  borrowerUnreadCount?: ModelIntInput | null,
  closedAt?: ModelStringInput | null,
  closedReason?: ModelLoanChatClosedReasonInput | null,
  createdAt?: ModelStringInput | null,
  handoffId?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  lastMessageAt?: ModelStringInput | null,
  lenderId?: ModelStringInput | null,
  lenderUnreadCount?: ModelIntInput | null,
  loanRequestId?: ModelStringInput | null,
  not?: ModelLoanChatConditionInput | null,
  or?: Array< ModelLoanChatConditionInput | null > | null,
  stage?: ModelLoanChatStageInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLoanChatInput = {
  activeLoanId?: string | null,
  bookId: string,
  borrowerId: string,
  borrowerUnreadCount?: number | null,
  closedAt?: string | null,
  closedReason?: LoanChatClosedReason | null,
  handoffId?: string | null,
  id?: string | null,
  isActive?: boolean | null,
  lastMessageAt?: string | null,
  lenderId: string,
  lenderUnreadCount?: number | null,
  loanRequestId: string,
  stage?: LoanChatStage | null,
};

export type ModelLoanHandoffConditionInput = {
  and?: Array< ModelLoanHandoffConditionInput | null > | null,
  borrowerConfirmed?: ModelBooleanInput | null,
  borrowerConfirmedAt?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  lenderConfirmed?: ModelBooleanInput | null,
  lenderConfirmedAt?: ModelStringInput | null,
  loanRequestId?: ModelStringInput | null,
  meetingLocation?: ModelStringInput | null,
  not?: ModelLoanHandoffConditionInput | null,
  or?: Array< ModelLoanHandoffConditionInput | null > | null,
  owner?: ModelStringInput | null,
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
  loanRequestId: string,
  meetingLocation?: string | null,
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
  owner?: ModelStringInput | null,
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

export type DeleteChatMessageInput = {
  id: string,
};

export type DeleteLoanChatInput = {
  id: string,
};

export type DeleteLoanHandoffInput = {
  id: string,
};

export type DeleteLoanRequestInput = {
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

export type UpdateChatMessageInput = {
  chatId?: string | null,
  content?: string | null,
  editedAt?: string | null,
  id: string,
  isEdited?: boolean | null,
  isRead?: boolean | null,
  isSystemMessage?: boolean | null,
  messageType?: ChatMessageMessageType | null,
  metadata?: string | null,
  readAt?: string | null,
  senderId?: string | null,
  senderRole?: ChatMessageSenderRole | null,
};

export type UpdateLoanChatInput = {
  activeLoanId?: string | null,
  bookId?: string | null,
  borrowerId?: string | null,
  borrowerUnreadCount?: number | null,
  closedAt?: string | null,
  closedReason?: LoanChatClosedReason | null,
  handoffId?: string | null,
  id: string,
  isActive?: boolean | null,
  lastMessageAt?: string | null,
  lenderId?: string | null,
  lenderUnreadCount?: number | null,
  loanRequestId?: string | null,
  stage?: LoanChatStage | null,
};

export type UpdateLoanHandoffInput = {
  borrowerConfirmed?: boolean | null,
  borrowerConfirmedAt?: string | null,
  completedAt?: string | null,
  id: string,
  lenderConfirmed?: boolean | null,
  lenderConfirmedAt?: string | null,
  loanRequestId?: string | null,
  meetingLocation?: string | null,
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

export type ModelSubscriptionChatMessageFilterInput = {
  and?: Array< ModelSubscriptionChatMessageFilterInput | null > | null,
  chatId?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  editedAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isEdited?: ModelSubscriptionBooleanInput | null,
  isRead?: ModelSubscriptionBooleanInput | null,
  isSystemMessage?: ModelSubscriptionBooleanInput | null,
  messageType?: ModelSubscriptionStringInput | null,
  metadata?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionChatMessageFilterInput | null > | null,
  readAt?: ModelSubscriptionStringInput | null,
  senderId?: ModelSubscriptionStringInput | null,
  senderRole?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionLoanChatFilterInput = {
  activeLoanId?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLoanChatFilterInput | null > | null,
  bookId?: ModelSubscriptionStringInput | null,
  borrowerId?: ModelSubscriptionStringInput | null,
  borrowerUnreadCount?: ModelSubscriptionIntInput | null,
  closedAt?: ModelSubscriptionStringInput | null,
  closedReason?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  handoffId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  lastMessageAt?: ModelSubscriptionStringInput | null,
  lenderId?: ModelSubscriptionStringInput | null,
  lenderUnreadCount?: ModelSubscriptionIntInput | null,
  loanRequestId?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLoanChatFilterInput | null > | null,
  stage?: ModelSubscriptionStringInput | null,
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
  loanRequestId?: ModelSubscriptionStringInput | null,
  meetingLocation?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLoanHandoffFilterInput | null > | null,
  owner?: ModelStringInput | null,
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
  lenderId?: ModelSubscriptionStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLoanRequestFilterInput | null > | null,
  owner?: ModelStringInput | null,
  proposedDuration?: ModelSubscriptionIntInput | null,
  requestedAt?: ModelSubscriptionStringInput | null,
  requesterId?: ModelSubscriptionStringInput | null,
  respondedAt?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
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

export type GetChatMessageQueryVariables = {
  id: string,
};

export type GetChatMessageQuery = {
  getChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type GetLoanChatQueryVariables = {
  id: string,
};

export type GetLoanChatQuery = {
  getLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
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
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type ListChatMessagesQueryVariables = {
  filter?: ModelChatMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChatMessagesQuery = {
  listChatMessages?:  {
    __typename: "ModelChatMessageConnection",
    items:  Array< {
      __typename: "ChatMessage",
      chatId: string,
      content: string,
      createdAt: string,
      editedAt?: string | null,
      id: string,
      isEdited?: boolean | null,
      isRead?: boolean | null,
      isSystemMessage?: boolean | null,
      messageType?: ChatMessageMessageType | null,
      metadata?: string | null,
      readAt?: string | null,
      senderId: string,
      senderRole?: ChatMessageSenderRole | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLoanChatsQueryVariables = {
  filter?: ModelLoanChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLoanChatsQuery = {
  listLoanChats?:  {
    __typename: "ModelLoanChatConnection",
    items:  Array< {
      __typename: "LoanChat",
      activeLoanId?: string | null,
      bookId: string,
      borrowerId: string,
      borrowerUnreadCount?: number | null,
      closedAt?: string | null,
      closedReason?: LoanChatClosedReason | null,
      createdAt: string,
      handoffId?: string | null,
      id: string,
      isActive?: boolean | null,
      lastMessageAt?: string | null,
      lenderId: string,
      lenderUnreadCount?: number | null,
      loanRequestId: string,
      stage?: LoanChatStage | null,
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
      loanRequestId: string,
      meetingLocation?: string | null,
      owner?: string | null,
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
      owner?: string | null,
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

export type CreateChatMessageMutationVariables = {
  condition?: ModelChatMessageConditionInput | null,
  input: CreateChatMessageInput,
};

export type CreateChatMessageMutation = {
  createChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type CreateLoanChatMutationVariables = {
  condition?: ModelLoanChatConditionInput | null,
  input: CreateLoanChatInput,
};

export type CreateLoanChatMutation = {
  createLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
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
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type DeleteChatMessageMutationVariables = {
  condition?: ModelChatMessageConditionInput | null,
  input: DeleteChatMessageInput,
};

export type DeleteChatMessageMutation = {
  deleteChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type DeleteLoanChatMutationVariables = {
  condition?: ModelLoanChatConditionInput | null,
  input: DeleteLoanChatInput,
};

export type DeleteLoanChatMutation = {
  deleteLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
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
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type UpdateChatMessageMutationVariables = {
  condition?: ModelChatMessageConditionInput | null,
  input: UpdateChatMessageInput,
};

export type UpdateChatMessageMutation = {
  updateChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type UpdateLoanChatMutationVariables = {
  condition?: ModelLoanChatConditionInput | null,
  input: UpdateLoanChatInput,
};

export type UpdateLoanChatMutation = {
  updateLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
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
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type OnCreateChatMessageSubscriptionVariables = {
  filter?: ModelSubscriptionChatMessageFilterInput | null,
};

export type OnCreateChatMessageSubscription = {
  onCreateChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLoanChatSubscriptionVariables = {
  filter?: ModelSubscriptionLoanChatFilterInput | null,
};

export type OnCreateLoanChatSubscription = {
  onCreateLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  owner?: string | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  owner?: string | null,
};

export type OnCreateLoanRequestSubscription = {
  onCreateLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type OnDeleteChatMessageSubscriptionVariables = {
  filter?: ModelSubscriptionChatMessageFilterInput | null,
};

export type OnDeleteChatMessageSubscription = {
  onDeleteChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLoanChatSubscriptionVariables = {
  filter?: ModelSubscriptionLoanChatFilterInput | null,
};

export type OnDeleteLoanChatSubscription = {
  onDeleteLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  owner?: string | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLoanRequestSubscription = {
  onDeleteLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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

export type OnUpdateChatMessageSubscriptionVariables = {
  filter?: ModelSubscriptionChatMessageFilterInput | null,
};

export type OnUpdateChatMessageSubscription = {
  onUpdateChatMessage?:  {
    __typename: "ChatMessage",
    chatId: string,
    content: string,
    createdAt: string,
    editedAt?: string | null,
    id: string,
    isEdited?: boolean | null,
    isRead?: boolean | null,
    isSystemMessage?: boolean | null,
    messageType?: ChatMessageMessageType | null,
    metadata?: string | null,
    readAt?: string | null,
    senderId: string,
    senderRole?: ChatMessageSenderRole | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLoanChatSubscriptionVariables = {
  filter?: ModelSubscriptionLoanChatFilterInput | null,
};

export type OnUpdateLoanChatSubscription = {
  onUpdateLoanChat?:  {
    __typename: "LoanChat",
    activeLoanId?: string | null,
    bookId: string,
    borrowerId: string,
    borrowerUnreadCount?: number | null,
    closedAt?: string | null,
    closedReason?: LoanChatClosedReason | null,
    createdAt: string,
    handoffId?: string | null,
    id: string,
    isActive?: boolean | null,
    lastMessageAt?: string | null,
    lenderId: string,
    lenderUnreadCount?: number | null,
    loanRequestId: string,
    stage?: LoanChatStage | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLoanHandoffSubscriptionVariables = {
  filter?: ModelSubscriptionLoanHandoffFilterInput | null,
  owner?: string | null,
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
    loanRequestId: string,
    meetingLocation?: string | null,
    owner?: string | null,
    scheduledTime?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLoanRequestSubscriptionVariables = {
  filter?: ModelSubscriptionLoanRequestFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLoanRequestSubscription = {
  onUpdateLoanRequest?:  {
    __typename: "LoanRequest",
    approvedDuration?: number | null,
    bookId: string,
    completedAt?: string | null,
    createdAt: string,
    dueDate?: string | null,
    id: string,
    lenderId: string,
    message?: string | null,
    owner?: string | null,
    proposedDuration?: number | null,
    requestedAt: string,
    requesterId: string,
    respondedAt?: string | null,
    status?: LoanRequestStatus | null,
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
