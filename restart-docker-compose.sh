#!/bin/bash

# Script to completely restart Docker containers with clean build
echo "🚀 Starting Docker system restart..."
docker-compose down

echo "1. Pruning Docker system..."
docker system prune -f

echo "2. Building containers with no cache..."
docker-compose build --no-cache

echo "3. Starting services..."
docker-compose up
