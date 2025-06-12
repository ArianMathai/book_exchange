import {defineFunction, secret} from '@aws-amplify/backend';

//amplify/functions/fetchMapsApiKey/resource.ts
export const fetchMapsApiKey = defineFunction({
    name: 'fetchMapsApiKey',
    entry: './handler.ts',
    environment: {
        GOOGLE_MAPS_API_KEY: secret('GOOGLE_MAPS_API_KEY')
    }
});