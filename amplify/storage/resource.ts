import { defineStorage } from '@aws-amplify/backend';

/**
 * Define storage for book images
 * @see https://docs.amplify.aws/gen2/build-a-backend/data/storage/
 */
export const bookStorage = defineStorage({
  name: 'BookExchangeStorage',
  access: (allow) => ({
    'bookImages/{entity_id}/*': [
      allow.entity('identity').to(['write', 'delete', 'read']), // ✅ owner can manage
      allow.authenticated.to(['read']),               // ✅ all logged-in users can read

    ],
  }),
});

