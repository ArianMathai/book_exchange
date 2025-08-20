import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bookStorage } from './storage/resource';
import {addressAutocomplete} from "./functions/addressAutocomplete/resource";


defineBackend({
  auth,
  data,
  bookStorage,
  addressAutocomplete
});
