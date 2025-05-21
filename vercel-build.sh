#!/bin/bash
echo "Setting up Vercel build environment..."

# Copy npm config files to the right locations
cp .npmrc ~/.npmrc
cp .pnpmrc ~/.pnpmrc

# Install dependencies with custom registry
echo "Installing dependencies..."
pnpm install

# Run the build
echo "Running build..."
pnpm build 