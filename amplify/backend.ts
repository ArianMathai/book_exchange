import { defineBackend } from '@aws-amplify/backend';
import { EventSourceMapping, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement, Policy } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bookStorage } from './storage/resource';
import { addressAutocomplete } from "./functions/addressAutocomplete/resource";
import { createActiveLoan } from "./functions/createActiveLoan/resource";

const backend = defineBackend({
  auth,
  data,
  bookStorage,
  addressAutocomplete,
  createActiveLoan
});

// Configure DynamoDB stream trigger for LoanHandoff table
const loanHandoffTable = backend.data.resources.tables["LoanHandoff"];

// Create IAM policy for DynamoDB stream permissions
const policy = new Policy(
  Stack.of(loanHandoffTable),
  "CreateActiveLoanStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);

// Attach the policy to the Lambda function's role
backend.createActiveLoan.resources.lambda.role?.attachInlinePolicy(policy);

// Configure event source mapping for the LoanHandoff table stream
const mapping = new EventSourceMapping(
  Stack.of(loanHandoffTable),
  "CreateActiveLoanLoanHandoffEventStreamMapping",
  {
    target: backend.createActiveLoan.resources.lambda,
    eventSourceArn: loanHandoffTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
    batchSize: 10,
    parallelizationFactor: 1
  }
);

// Ensure the policy is attached before the mapping is created
mapping.node.addDependency(policy);
