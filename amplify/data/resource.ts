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
          books: a.hasMany("Book", "ownerId")
      })
      .identifier(['sub']) // Use Cognito sub as unique ID
      .authorization((allow) => [allow.owner()]),



  Book: a.model({
    title: a.string().required(),
    author: a.string().required(),
    isbn: a.string(), // optional
    ownerId: a.string().required(),
    ownerEmail: a.string().required(),
    createdAt: a.timestamp().required(),
    loanedOut: a.boolean().required(),
    loanedTo: a.string(),
    imageUrl: a.string(), // optional - stores the book cover image URL
    imageSource: a.string(), // optional - tracks how the image was obtained ('manual', 'google_books', or null)
      ownerRef: a.belongsTo("User", "ownerId")  // Link to User
  }).authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['read', "create", "update", "delete"]),
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
