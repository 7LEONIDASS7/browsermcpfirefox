# Firefox Extension Testing Guide

## Setup Instructions

1. **Install the Firefox Extension:**
   - Open Firefox
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Navigate to `firefox-extension/` folder
   - Select `manifest.json`

2. **Start the MCP Server:**
   ```bash
   node dist/index.js --ws-port 9001 --force
   ```

3. **Test the Connection:**
   - Click the Browser MCP extension icon in Firefox toolbar
   - Click "Connect" in the popup
   - Status should show "Connected" with green dot

## Testing Browser Automation

With Claude Code running, you can now use browser automation commands:
- `Navigate to https://example.com`
- `Click on the search button`
- `Type "hello world" in the input field`
- `Take a screenshot`

## Troubleshooting

- Make sure port 9001 is not blocked by firewall
- Check Firefox console for WebSocket connection errors
- Verify MCP server is running before connecting extension

## Extension Features

- Connects to MCP server on ws://localhost:9001
- Handles all browser automation commands (navigate, click, type, etc.)  
- Visual connection status in popup
- Automatic reconnection on server restart