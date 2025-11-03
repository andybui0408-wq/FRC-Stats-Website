#!/bin/bash

# FRC Scouting Dashboard Launch Script

echo "🚀 Starting FRC Scouting Dashboard..."
echo "📊 Opening dashboard in your default browser..."

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 to serve the application..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Using Python to serve the application..."
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python to run the local server."
    echo "Alternatively, you can open index.html directly in your browser."
    exit 1
fi
