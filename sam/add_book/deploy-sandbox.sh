#!/bin/bash

# Get current directory name (lambda function name)
FUNCTION_NAME=$(basename "$PWD")

echo "🚀 Deploying $FUNCTION_NAME to Amplify Sandbox environment..."

# Direct path to amplify_outputs.json
AMPLIFY_OUTPUTS_FILE="../../amplify_outputs.json"

# Check if the file exists
if [ ! -f "$AMPLIFY_OUTPUTS_FILE" ]; then
    echo "❌ amplify_outputs.json not found at: $AMPLIFY_OUTPUTS_FILE"
    exit 1
fi

echo "✅ Found amplify_outputs.json"

# Get the user pool ID using Node.js
echo "📡 Getting Cognito User Pool ID from amplify_outputs.json..."
SANDBOX_USER_POOL_ID=$(node -p "JSON.parse(require('fs').readFileSync('$AMPLIFY_OUTPUTS_FILE', 'utf8')).auth.user_pool_id" 2>/dev/null)

if [ -z "$SANDBOX_USER_POOL_ID" ] || [ "$SANDBOX_USER_POOL_ID" = "undefined" ]; then
    echo "❌ Could not retrieve User Pool ID from amplify_outputs.json"
    echo "📄 Check if the file has the correct structure"
    exit 1
fi

echo "✅ Found User Pool ID: $SANDBOX_USER_POOL_ID"

# Deploy SAM template with the dynamic user pool ID
echo "🚀 Deploying Lambda function..."
sam deploy \
  --config-env sandbox \
  --parameter-overrides \
    "Environment=sandbox" \
    "CognitoUserPoolId=$SANDBOX_USER_POOL_ID"

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed $FUNCTION_NAME to sandbox environment!"
    echo "🔗 Lambda function is now using User Pool: $SANDBOX_USER_POOL_ID"
else
    echo "❌ Deployment failed"
    exit 1
fi