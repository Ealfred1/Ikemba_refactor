#!/bin/bash

echo "🎨 Ikemba Images Background Removal Setup"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

echo "✅ Python3 found"

# Install required packages
echo "📦 Installing required packages..."
pip3 install -r requirements.txt

# Make the Python script executable
chmod +x remove_backgrounds.py

# Run the background removal script
echo "🚀 Starting background removal process..."
python3 remove_backgrounds.py

echo "✅ Background removal complete!"
echo "📁 Check your ikemba_images folder for files with '_no_bg.png' suffix"
