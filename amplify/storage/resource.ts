import { defineStorage } from '@aws-amplify/backend';

/**
 * Define storage for book images
 * @see https://docs.amplify.aws/gen2/build-a-backend/data/storage/
 */
export const bookStorage = defineStorage({
  name: 'BookExchangeStorage',
  access: (allow) => ({
    // 🔐 Authenticated user can fully manage files only in their own folder
    'bookImages/{entity_id}/*': [
        allow.authenticated.to(['read']),
      allow.entity('identity').to(['write', 'read', 'delete']),
    ],

  }),
});
