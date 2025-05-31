import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bookStorage } from './storage/resource';

defineBackend({
  auth,
  data,
  bookStorage,
});
