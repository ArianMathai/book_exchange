import { defineFunction } from '@aws-amplify/backend';

export const approveLoanRequest = defineFunction({
  name: 'approveLoanRequest',
  entry: './handler.ts',
});