#!/bin/bash

echo "🦊 Firefox MCP Extension Test Script"
echo "======================================"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ directory not found. Running build..."
    npm run build
fi

# Check if firefox-extension directory exists  
if [ ! -d "firefox-extension" ]; then
    echo "❌ firefox-extension/ directory not found!"
    exit 1
fi

echo "✅ Build directory exists"
echo "✅ Firefox extension directory exists"

# Test MCP server startup
echo ""
echo "🧪 Testing MCP server startup..."
node dist/index.js --ws-port 9001 --force &
SERVER_PID=$!

sleep 2

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ MCP server started successfully on port 9001"
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
else
    echo "❌ MCP server failed to start"
    exit 1
fi

echo ""
echo "🎉 Firefox MCP setup is ready!"
echo ""
echo "Next steps:"
echo "1. Open Firefox"
echo "2. Go to about:debugging#/runtime/this-firefox"  
echo "3. Click 'Load Temporary Add-on'"
echo "4. Select firefox-extension/manifest.json"
echo "5. Start MCP server: node dist/index.js --ws-port 9001 --force"
echo "6. Click the extension icon and Connect"