#!/bin/bash
set -e

echo "🚀 Deploying Hustoro Frontend"

SRC="/var/www/hustoro-src"
DEST="/var/www/hustoro"
BACKUP_ROOT="/var/www/backups/hustoro_frontend"
TIMESTAMP=$(date +%F-%H%M)
BACKUP_PATH="$BACKUP_ROOT/hustoro-$TIMESTAMP"

mkdir -p "$BACKUP_ROOT"
cd "$SRC"

git fetch origin
UPDATES=$(git rev-list HEAD...origin/main --count)

if [ "$UPDATES" -eq 0 ]; then
  echo "✅ Frontend already up to date"
  exit 0
fi

echo "📦 Backup existing build..."
rsync -av "$DEST/" "$BACKUP_PATH/"

echo "⬇ Pulling latest frontend source..."
git reset --hard origin/main

echo "📦 Installing dependencies..."
npm install

echo "🏗 Building frontend..."
npm run build

echo "🚚 Replacing build output..."
rm -rf "$DEST"/*
cp -r dist/* "$DEST/"

echo "✅ Frontend deployment completed"
