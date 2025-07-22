# Browser MCP Firefox

A TypeScript/Node.js CLI tool that provides a Model-Context-Protocol (MCP) server for browser automation. This server bridges AI agents (VS Code, Cursor, Claude) with browser extensions via WebSocket, enabling automated browser interactions like navigation, clicking, screenshots, and more.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Development](#development)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Overview

Browser MCP Firefox exposes your local Firefox browser (via a companion Web Extension) to AI agents through the Model Context Protocol (MCP). The server acts as a bridge:

- **Upstream**: Communicates with AI agents via stdio transport
- **Downstream**: Connects to browser extension via WebSocket
- **Tools**: Provides browser automation capabilities (navigate, click, type, screenshot, etc.)

## Features

### Browser Automation Tools
- **Navigation**: Navigate to URLs, go back/forward in history
- **DOM Interaction**: Click, hover, type, drag, select options
- **Information Gathering**: Take screenshots, capture console logs, ARIA snapshots
- **Utilities**: Wait for specified time, press keys

### Safety & Configuration
- **Port Management**: Safe port handling with `--force` flag for process termination
- **Flexible Configuration**: Custom WebSocket ports, configurable timeouts
- **Error Handling**: Comprehensive error messages and recovery
- **Type Safety**: Full TypeScript support with runtime validation

## Installation

### Prerequisites
- Node.js 18 or higher
- Firefox browser with Browser MCP extension (required)
- Operating System: macOS, Windows, or Linux

### Install Dependencies
```bash
npm install
```

### Build the Project
```bash
npm run build
```

## Quick Start

1. **Start the MCP Server**:
   ```bash
   npm start
   # or
   node dist/index.js
   ```

2. **Connect Browser Extension**:
   - Open Firefox
   - Click the Browser MCP extension icon
   - Click "Connect" to establish WebSocket connection

3. **Use with AI Agents**:
   The server will be available via stdio transport for MCP-compatible AI agents.

## CLI Usage

### Basic Command
```bash
node dist/index.js [options]
```

### Options
- `--ws-port <port>`: WebSocket port to use (default: 9001)
- `--force`: Force kill existing processes on the specified port
- `--version`: Show version information
- `--help`: Show help information

### Examples
```bash
# Use default port (9001)
node dist/index.js

# Use custom port
node dist/index.js --ws-port 9002

# Force kill process on port and use custom port
node dist/index.js --ws-port 9002 --force
```

## API Documentation

See [API Documentation](./API.md) for comprehensive details on:
- Available tools and their parameters
- Request/response formats
- Error handling
- Usage examples

## Architecture

See [Architecture Guide](./ARCHITECTURE.md) for detailed information about:
- System design and components
- Data flow and communication patterns
- Extension points and customization
- Security considerations

## Development

### Development Workflow
```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Build the project
npm run build

# Watch for changes during development
npm run watch
```

### Project Structure
```
browsermcpfirefox/
├── src/                    # TypeScript source code
│   ├── tools/             # Browser automation tools
│   ├── context.ts         # WebSocket context management
│   ├── server.ts          # MCP server implementation
│   ├── utils/             # Utility functions
│   └── index.ts           # CLI entry point
├── lib/                   # Local dependency replacements
├── docs/                  # Documentation
├── dist/                  # Built JavaScript (generated)
└── package.json
```

### Adding New Tools
See [Development Guide](./DEVELOPMENT.md) for information on:
- Creating custom browser automation tools
- Extending the WebSocket protocol
- Adding new MCP resources

## Security

### Security Considerations
- **Local Network Only**: WebSocket server binds to localhost by default
- **No Authentication**: Relies on OS-level security and firewall
- **Browser Access**: Uses logged-in Firefox profile with full credential scope
- **Process Management**: `--force` flag can terminate arbitrary processes

### Best Practices
- Run on trusted machines only
- Use firewall to block external access to WebSocket port
- Be cautious with `--force` flag on shared systems
- Monitor for unauthorized WebSocket connections

## Troubleshooting

### Common Issues

#### Port Already in Use
```
Error: Port 9001 is already in use. Use --force flag to kill existing process.
```
**Solution**: Use `--force` flag or specify a different port:
```bash
node dist/index.js --force
# or
node dist/index.js --ws-port 9002
```

#### No Browser Connection
```
No connection to browser extension. Connect a tab by clicking the Browser MCP extension icon...
```
**Solutions**:
1. Install and enable the Browser MCP extension in Firefox
2. Click the extension icon and select "Connect"
3. Ensure WebSocket port matches (default: 9001)

#### Build Errors
```
ESM Build failed
```
**Solutions**:
1. Check Node.js version (requires 18+)
2. Run `npm install` to ensure dependencies are installed
3. Check TypeScript errors with `npm run typecheck`

#### WebSocket Connection Failed
**Solutions**:
1. Verify port is not blocked by firewall
2. Check if another service is using the port
3. Try a different port with `--ws-port`

### Debug Mode
Enable detailed logging by examining WebSocket messages in the browser's developer console.

### Getting Help
- Check the [GitHub Issues](https://github.com/browsermcp/mcp/issues) for known problems
- Review the troubleshooting section in individual documentation files
- Ensure all prerequisites are met

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Add tests if applicable
5. Run `npm run typecheck` and `npm run build`
6. Submit a pull request

---

For detailed API documentation, architecture information, and development guides, see the files in the `docs/` directory.