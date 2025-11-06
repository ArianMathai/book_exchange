import { defineFunction, secret } from '@aws-amplify/backend';


export const addressAutocomplete = defineFunction({
    name: 'addressAutocomplete',
    environment: {
        GOOGLE_MAPS_API_KEY: secret('GOOGLE_MAPS_API_KEY')
    },
});
