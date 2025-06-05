import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
  Book: a.model({
    title: a.string().required(),
    author: a.string().required(),
    isbn: a.string(), // optional
    owner: a.string().required(),
    ownerEmail: a.string().required(),
    createdAt: a.timestamp().required(),
    loanedOut: a.boolean().required(),
    loanedTo: a.string(),
    imageUrl: a.string(), // optional - stores the book cover image URL
    imageSource: a.string(), // optional - tracks how the image was obtained ('manual', 'google_books', or null)
  }).authorization(allow => [allow.owner()]),
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
