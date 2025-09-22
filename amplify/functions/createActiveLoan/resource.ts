import { defineFunction } from '@aws-amplify/backend';

export const createActiveLoan = defineFunction({
  name: 'createActiveLoan',
  entry: './handler.ts',
  resourceGroupName: 'data',
});