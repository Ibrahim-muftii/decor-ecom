#!/bin/bash

# ==========================================
# Decor E-com Deployment Script
# ==========================================

# 1. CONFIGURATION
# ------------------------------------------
# Replace these values with your server details
SERVER_USER="ubuntu"              # e.g., root, ubuntu
SERVER_IP="129.153.192.144"                # e.g., 192.168.1.1
SSH_KEY_PATH="/e/TechScribeX/oracle_key" # Path to your private key
APP_DIR="/home/ubuntu/decor-ecom"      # Full path to your app on the server
APP_NAME="decor-app"              # PM2 app name
BRANCH="master"                      # Git branch to deploy

# 2. LOCAL OPERATIONS
# ------------------------------------------
echo "🚀 Starting Deployment Process..."

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes."
    read -p "Do you want to commit and push them? (y/n) " -n 1 -r
    echo 
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " msg
        git add .
        git commit -m "$msg"
    else
        echo "❌ Deployment aborted. Please commit changes first."
        exit 1
    fi
fi

echo "📦 Pushing changes to GitHub ($BRANCH)..."
git push origin $BRANCH

if [ $? -ne 0 ]; then
    echo "❌ Git push failed. Deployment aborted."
    exit 1
fi

# 3. REMOTE OPERATIONS
# ------------------------------------------
echo "⚡ Connecting to server $SERVER_IP..."

ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP << EOF
    # Load NVM and Profile
    export NVM_DIR="\$HOME/.nvm"
    [ -s "\$NVM_DIR/nvm.sh" ] && \\. "\$NVM_DIR/nvm.sh"
    source ~/.profile
    source ~/.bashrc

    echo "📂 Navigating to app directory: $APP_DIR"
    cd $APP_DIR

    echo "⬇️  Pulling latest code..."
    git pull origin $BRANCH

    echo "🗑️  Removing old build..."
    rm -rf .next

    echo "📦 Installing dependencies..."
    npm install

    echo "🔨 Building the application..."
    npm run build

    echo "🔄 Restarting application..."
    pm2 restart $APP_NAME || pm2 start npm --name "$APP_NAME" -- start

    echo "✅ Deployment Complete!"
EOF
