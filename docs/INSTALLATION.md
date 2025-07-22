# Installation and Setup Guide

This guide provides comprehensive installation instructions for Browser MCP Firefox on different platforms and environments.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Platform-Specific Setup](#platform-specific-setup)
- [Browser Extension Setup](#browser-extension-setup)
- [Configuration](#configuration)
- [Verification](#verification)
- [AI Agent Integration](#ai-agent-integration)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (included with Node.js)
- **Firefox**: Latest stable version recommended
- **Operating System**: macOS, Windows 10/11, or Linux
- **Memory**: 512MB RAM available
- **Disk Space**: 200MB for installation and dependencies

### Recommended Requirements
- **Node.js**: Version 20.0 or higher
- **Memory**: 1GB RAM available
- **Network**: Localhost access (for WebSocket communication)
- **Development**: TypeScript knowledge for customization

### Supported Platforms
- ✅ macOS (Intel and Apple Silicon)
- ✅ Windows 10/11 (x64)
- ✅ Linux (Ubuntu, Debian, CentOS, Fedora, Arch)
- ✅ WSL2 (Windows Subsystem for Linux)
- ⚠️ Docker (requires additional network configuration)

## Quick Installation

### For End Users
```bash
# Clone the repository
git clone https://github.com/browsermcp/mcp.git
cd mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
node dist/index.js
```

### For Developers
```bash
# Clone for development
git clone https://github.com/browsermcp/mcp.git
cd mcp

# Install all dependencies including dev dependencies
npm install

# Run type checking
npm run typecheck

# Build and start in watch mode
npm run watch &
node dist/index.js
```

## Platform-Specific Setup

### macOS

#### Using Node Version Manager (Recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### Using Homebrew
```bash
# Install Node.js via Homebrew
brew install node@20

# Verify installation
node --version
npm --version

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### macOS Security Considerations
```bash
# Allow network connections (if prompted)
# Go to System Preferences > Security & Privacy > Firewall
# Allow "Node" to accept incoming connections

# For corporate networks, you may need to configure proxy
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

### Windows

#### Using Node.js Installer (Recommended)
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer as Administrator
3. Select "Add to PATH" during installation
4. Open Command Prompt or PowerShell as Administrator

```powershell
# Verify installation
node --version
npm --version

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### Using Chocolatey
```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### Windows-Specific Configuration
```powershell
# Set execution policy for npm scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Configure Windows Defender exclusion (if needed)
# Add the project directory to Windows Defender exclusions
# to prevent interference with file watching
```

### Linux

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build essentials (if not already installed)
sudo apt-get install -y build-essential

# Verify installation
node --version
npm --version

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### CentOS/RHEL/Fedora
```bash
# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs npm

# Fedora
sudo dnf install nodejs npm

# Install development tools
sudo yum groupinstall "Development Tools"  # CentOS/RHEL
# or
sudo dnf groupinstall "Development Tools"  # Fedora

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

#### Arch Linux
```bash
# Install Node.js and npm
sudo pacman -S nodejs npm

# Install base development tools
sudo pacman -S base-devel

# Install Browser MCP Firefox
git clone https://github.com/browsermcp/mcp.git
cd mcp
npm install
npm run build
```

## Browser Extension Setup

### Firefox Extension Installation

#### Option 1: Firefox Add-ons Store (Recommended)
1. Open Firefox
2. Go to [Firefox Add-ons](https://addons.mozilla.org/)
3. Search for "Browser MCP"
4. Click "Add to Firefox"
5. Click "Add" when prompted
6. Grant necessary permissions

#### Option 2: Manual Installation (Development)
1. Download the extension from the releases page
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the extension file (.xpi)

#### Option 3: Developer Mode
```bash
# For extension development
git clone https://github.com/browsermcp/browser-extension.git
cd browser-extension
npm install
npm run build

# Load in Firefox:
# 1. Go to about:debugging
# 2. Click "This Firefox"
# 3. Click "Load Temporary Add-on"
# 4. Select manifest.json from the built extension
```

### Extension Configuration
1. **Click Extension Icon**: After installation, click the Browser MCP icon in the toolbar
2. **Configure Settings**:
   - WebSocket URL: `ws://localhost:9001` (default)
   - Connection timeout: 30 seconds (default)
   - Auto-reconnect: Enabled (recommended)
3. **Test Connection**: Click "Connect" to test the connection

### Extension Permissions
The extension requires these permissions:
- **Active Tab**: Access to the current tab's content
- **Host Permissions**: Access to all websites for automation
- **WebSocket**: Communication with the local MCP server
- **Storage**: Save connection settings

## Configuration

### Server Configuration
Create a configuration file (optional):

```javascript
// config/mcp.config.js
export const mcpConfig = {
  defaultWsPort: 9001,
  maxConnections: 1,
  connectionTimeout: 30000,
  errors: {
    noConnectedTab: "No connected tab available"
  }
};
```

### Environment Variables
```bash
# Set custom WebSocket port
export MCP_WS_PORT=9002

# Enable debug logging
export DEBUG=mcp:*

# Set connection timeout (milliseconds)
export MCP_CONNECTION_TIMEOUT=45000
```

### CLI Configuration
```bash
# Use custom port
node dist/index.js --ws-port 9002

# Enable force mode (kills processes on port)
node dist/index.js --force

# Combine options
node dist/index.js --ws-port 9002 --force
```

### Firewall Configuration

#### macOS Firewall
```bash
# Add firewall rule (if needed)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

#### Windows Firewall
```powershell
# Allow Node.js through Windows Firewall
netsh advfirewall firewall add rule name="Browser MCP Server" dir=in action=allow protocol=TCP localport=9001
```

#### Linux iptables
```bash
# Allow local connections to port 9001
sudo iptables -A INPUT -s 127.0.0.1 -p tcp --dport 9001 -j ACCEPT

# Make rule persistent (Ubuntu/Debian)
sudo iptables-save > /etc/iptables/rules.v4
```

## Verification

### Basic Functionality Test
```bash
# 1. Start the server
node dist/index.js --ws-port 9001

# Expected output:
# Browser MCP Server starting...
# WebSocket server listening on port 9001
# MCP server ready for connections
```

### Connection Test
```bash
# 2. In Firefox, click Browser MCP extension icon
# 3. Click "Connect"
# Expected: Green connection indicator

# 4. Check server logs for connection message
# Expected output:
# WebSocket client connected
# Browser extension ready
```

### Tool Functionality Test
```bash
# Use MCP Inspector for testing
npx @modelcontextprotocol/inspector node dist/index.js

# Test basic navigation tool:
# 1. Call "navigate" with URL: "https://example.com"
# 2. Expected: Browser navigates to example.com
# 3. Response contains navigation confirmation
```

### Health Check
```bash
# Check server health
curl -f http://localhost:9001/health 2>/dev/null && echo "Server healthy" || echo "Server unavailable"

# Check WebSocket connection
node -e "
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9001');
ws.on('open', () => { console.log('WebSocket OK'); process.exit(0); });
ws.on('error', (err) => { console.error('WebSocket Error:', err.message); process.exit(1); });
setTimeout(() => { console.error('WebSocket Timeout'); process.exit(1); }, 5000);
"
```

## AI Agent Integration

### Claude Code Integration
```json
// Add to your MCP configuration
{
  "mcpServers": {
    "browsermcp": {
      "command": "node",
      "args": ["/path/to/browsermcp/dist/index.js"],
      "env": {
        "MCP_WS_PORT": "9001"
      }
    }
  }
}
```

### VS Code Integration
```json
// settings.json
{
  "mcp.servers": [
    {
      "name": "Browser MCP",
      "command": "node",
      "args": ["/path/to/browsermcp/dist/index.js"],
      "env": {
        "MCP_WS_PORT": "9001"
      }
    }
  ]
}
```

### Cursor Integration
```json
// cursor.json
{
  "mcp": {
    "servers": {
      "browsermcp": {
        "command": "node /path/to/browsermcp/dist/index.js"
      }
    }
  }
}
```

## Troubleshooting

### Common Installation Issues

#### Node.js Version Error
```
Error: Unsupported Node.js version
```
**Solution:**
```bash
# Check current version
node --version

# Install Node.js 18+ using your platform's method
# See platform-specific sections above
```

#### npm Install Failures
```
Error: EACCES permission denied
```
**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use a Node version manager instead of system Node
```

#### Build Errors
```
Error: TypeScript compilation failed
```
**Solution:**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for TypeScript errors
npm run typecheck
```

### Runtime Issues

#### Port Already in Use
```
Error: Port 9001 is already in use
```
**Solutions:**
```bash
# Option 1: Use different port
node dist/index.js --ws-port 9002

# Option 2: Kill process using port (be careful!)
node dist/index.js --force

# Option 3: Find and manually kill the process
lsof -ti:9001 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :9001   # Windows
```

#### Extension Connection Failed
```
No connection to browser extension
```
**Solutions:**
1. Verify extension is installed and enabled
2. Check extension permissions are granted
3. Ensure WebSocket port matches (server and extension)
4. Try refreshing the browser page
5. Restart both server and browser

#### Firewall Blocking Connection
**Solutions:**
```bash
# Temporarily disable firewall to test
sudo ufw disable  # Ubuntu
# Test connection, then re-enable with proper rules

# Add specific rule instead
sudo ufw allow from 127.0.0.1 to any port 9001
```

### Getting Additional Help

#### Log Collection
```bash
# Enable detailed logging
DEBUG=* node dist/index.js > mcp-server.log 2>&1

# Check browser extension logs
# Firefox: about:debugging > Browser MCP > Inspect > Console
```

#### System Information
```bash
# Collect system info for bug reports
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "OS: $(uname -a)"
echo "Browser MCP version: $(node -e 'console.log(require("./package.json").version)')"
```

#### Community Support
- **GitHub Issues**: Report bugs with system information and logs
- **Discord/Chat**: Real-time help from community
- **Documentation**: Check other docs files for specific topics

---

For usage instructions and examples, see [README.md](./README.md).
For development setup, see [DEVELOPMENT.md](./DEVELOPMENT.md).