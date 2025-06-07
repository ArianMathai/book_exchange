import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bookStorage } from './storage/resource';
import {fetchMapsApiKey} from "./functions/fetchMapsApiKey/resource";

defineBackend({
  auth,
  data,
  bookStorage,
  fetchMapsApiKey
});
