#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Setting up Vercel build environment..."

# Copy npm config files to the right locations
cp .npmrc ~/.npmrc
cp .pnpmrc ~/.pnpmrc

# Ensure pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Print versions for debugging
echo "Node version: $(node -v)"
echo "PNPM version: $(pnpm -v)"

# Install dependencies with custom registry
echo "Installing dependencies..."
pnpm install

# Build the web app
echo "Running build for web app..."
cd apps/web
pnpm build

echo "Build completed successfully!" 