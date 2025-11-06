# Deploy to sandbox (dynamic user pool)
./deploy-sandbox.sh

# Deploy to dev (static user pool)
sam deploy --config-env dev

# Deploy to production (static user pool)
sam deploy --config-env prod