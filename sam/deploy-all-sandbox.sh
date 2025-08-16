#!/bin/bash

# Deploy all Lambda functions in sam/ to the Amplify Sandbox environment,
# using the same approach as your per-function deploy-sandbox script.

# Not yet tested

set -u

# ---- Colors ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying ALL Lambda functions to Amplify Sandbox environment...${NC}"
echo "=================================================="

# ---- Resolve paths relative to this script ----
SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AMPLIFY_OUTPUTS_FILE="$ROOT_DIR/amplify_outputs.json"

# ---- Basic checks ----
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}❌ Node.js is required but was not found in PATH.${NC}"
  exit 1
fi

if ! command -v sam >/dev/null 2>&1; then
  echo -e "${RED}❌ AWS SAM CLI is required but was not found in PATH.${NC}"
  exit 1
fi

if [ ! -f "$AMPLIFY_OUTPUTS_FILE" ]; then
  echo -e "${RED}❌ amplify_outputs.json not found at: $AMPLIFY_OUTPUTS_FILE${NC}"
  echo "   Make sure Amplify Sandbox has been started and outputs saved."
  exit 1
fi

echo -e "${YELLOW}📄 Using amplify_outputs.json at:${NC} $AMPLIFY_OUTPUTS_FILE"

# ---- Get Cognito User Pool ID (same method as your deploy-sandbox) ----
echo -e "${YELLOW}🔐 Extracting Cognito User Pool ID...${NC}"
SANDBOX_USER_POOL_ID=$(node -p "JSON.parse(require('fs').readFileSync('$AMPLIFY_OUTPUTS_FILE','utf8')).auth.user_pool_id" 2>/dev/null)

if [ -z "$SANDBOX_USER_POOL_ID" ] || [ "$SANDBOX_USER_POOL_ID" = "undefined" ]; then
  echo -e "${RED}❌ Could not retrieve User Pool ID from amplify_outputs.json${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Found User Pool ID: $SANDBOX_USER_POOL_ID${NC}"
echo ""

# ---- Functions to deploy (folders inside sam/) ----
LAMBDA_FUNCTIONS=(
  "add_book"
  "get_book_indexes"
  "upsert_user_location"
)

SUCCESSFUL_DEPLOYMENTS=()
FAILED_DEPLOYMENTS=()

deploy_lambda() {
  local lambda_dir="$1"
  local lambda_path="$SCRIPT_DIR/$lambda_dir"

  echo -e "${BLUE}📦 Deploying ${lambda_dir}...${NC}"
  echo "--------------------------------------------------"

  if [ ! -d "$lambda_path" ]; then
    echo -e "${RED}❌ Directory ${lambda_dir} does not exist. Skipping...${NC}"
    FAILED_DEPLOYMENTS+=("${lambda_dir} (directory not found)")
    return 1
  fi

  pushd "$lambda_path" >/dev/null || {
    echo -e "${RED}❌ Could not enter directory ${lambda_dir}${NC}"
    FAILED_DEPLOYMENTS+=("${lambda_dir} (could not enter directory)")
    return 1
  }

  # Require template.yaml in each function dir (same structure as your other script)
  if [ ! -f "template.yaml" ]; then
    echo -e "${RED}❌ template.yaml not found in ${lambda_dir}${NC}"
    FAILED_DEPLOYMENTS+=("${lambda_dir} (no template.yaml)")
    popd >/dev/null
    return 1
  fi

  # Run SAM deploy using the sandbox config + parameter overrides (same style as your per-function script)
  if sam deploy \
      --config-env sandbox \
      --parameter-overrides \
        "Environment=sandbox" \
        "CognitoUserPoolId=$SANDBOX_USER_POOL_ID"
  then
    echo -e "${GREEN}✅ Successfully deployed ${lambda_dir}${NC}"
    SUCCESSFUL_DEPLOYMENTS+=("${lambda_dir}")
  else
    echo -e "${RED}❌ Deployment failed for ${lambda_dir}${NC}"
    FAILED_DEPLOYMENTS+=("${lambda_dir} (deployment failed)")
  fi

  popd >/dev/null
  echo ""
}

# ---- Deploy all ----
for lambda in "${LAMBDA_FUNCTIONS[@]}"; do
  deploy_lambda "$lambda"
done

# ---- Summary ----
echo "=================================================="
echo -e "${BLUE}📋 DEPLOYMENT SUMMARY${NC}"
echo "=================================================="

if [ ${#SUCCESSFUL_DEPLOYMENTS[@]} -gt 0 ]; then
  echo -e "${GREEN}✅ Successful deployments (${#SUCCESSFUL_DEPLOYMENTS[@]}):${NC}"
  for s in "${SUCCESSFUL_DEPLOYMENTS[@]}"; do
    echo -e "   ${GREEN}• $s${NC}"
  done
  echo ""
fi

if [ ${#FAILED_DEPLOYMENTS[@]} -gt 0 ]; then
  echo -e "${RED}❌ Failed deployments (${#FAILED_DEPLOYMENTS[@]}):${NC}"
  for f in "${FAILED_DEPLOYMENTS[@]}"; do
    echo -e "   ${RED}• $f${NC}"
  done
  echo ""
fi

if [ ${#FAILED_DEPLOYMENTS[@]} -eq 0 ]; then
  echo -e "${GREEN}🎉 All Lambda functions deployed successfully to sandbox!${NC}"
  echo -e "${GREEN}🔗 Using User Pool: $SANDBOX_USER_POOL_ID${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some deployments failed. Check the output above for details.${NC}"
  exit 1
fi
