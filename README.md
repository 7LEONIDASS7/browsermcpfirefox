# Browser MCP Firefox

A TypeScript/Node.js CLI tool that provides a Model Context Protocol (MCP) server for browser automation. Bridge AI agents (VS Code, Cursor, Claude) with Firefox browser extension via WebSocket for seamless browser automation.

## ✨ Features

- **🚀 Fast**: Local automation without network latency
- **🔒 Private**: Browser activity stays on your device  
- **👤 Logged In**: Uses existing Firefox profile and sessions
- **🥷 Stealth**: Avoids bot detection using real browser fingerprint
- **🛠️ Comprehensive**: Navigate, click, type, screenshot, console logs, and more
- **🔧 Flexible**: Configurable ports, safe process management, TypeScript support

## 🎯 What It Does

Browser MCP Firefox acts as a bridge between AI agents and browser automation:

```
AI Agent (Claude, VS Code, Cursor) ←→ MCP Server ←→ Firefox Extension ←→ Browser
       ↑ stdio transport ↑              ↑ WebSocket ↑
```

**Available Tools:**
- **Navigation**: navigate, go_back, go_forward
- **Interaction**: click, hover, type, drag, select_option
- **Information**: screenshot, get_console_logs, snapshot (ARIA tree)
- **Utilities**: wait, press_key

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firefox browser
- Browser MCP extension (install from Firefox Add-ons)

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd browsermcpfirefox
npm install
npm run build

# Start the MCP server
node dist/index.js
```

### Connect Browser
1. Open Firefox
2. Click Browser MCP extension icon  
3. Click "Connect" to establish WebSocket connection

### Use with AI Agents
The server is now available via stdio transport for MCP-compatible AI agents.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[📋 Installation Guide](./docs/INSTALLATION.md)** - Detailed setup for all platforms
- **[🔧 API Documentation](./docs/API.md)** - Complete tool reference and examples  
- **[🏗️ Architecture Guide](./docs/ARCHITECTURE.md)** - System design and components
- **[👨‍💻 Development Guide](./docs/DEVELOPMENT.md)** - Contributing and extending
- **[🛡️ Security Guide](./docs/SECURITY.md)** - Security considerations and best practices

## ⚡ CLI Usage

```bash
# Basic usage
node dist/index.js

# Custom port
node dist/index.js --ws-port 9002

# Force kill processes on port (use carefully!)
node dist/index.js --force

# Get help
node dist/index.js --help
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck  

# Build project
npm run build

# Watch mode (rebuilds on changes)
npm run watch
```

## 🔒 Security

Browser MCP Firefox includes several security considerations:

- **Local Network Only**: WebSocket server binds to localhost
- **No Authentication**: Relies on OS-level access control
- **Browser Session Access**: Uses logged-in Firefox profile  
- **Safe Defaults**: Requires `--force` flag for process termination

See [Security Guide](./docs/SECURITY.md) for comprehensive security information.

## 🏗️ Architecture

**Clean Architecture Pattern:**
- **Tools Layer**: Browser automation capabilities
- **Server Core**: MCP protocol handling and tool routing
- **Adapters**: stdio (AI agents) and WebSocket (browser) communication
- **Utilities**: ARIA snapshots, port management, logging

**Key Technologies:**
- TypeScript with strict mode and ES2022
- Model Context Protocol SDK
- WebSocket communication (ws library)
- Zod for runtime type validation
- Commander.js for CLI interface

## 🤝 Contributing

We welcome contributions! See [Development Guide](./docs/DEVELOPMENT.md) for:

- Development setup and workflow
- Adding new browser automation tools
- Code standards and best practices
- Testing and debugging

## 🐛 Troubleshooting

**Common Issues:**

**Port in use:**
```bash
node dist/index.js --ws-port 9002  # Use different port
# or
node dist/index.js --force         # Kill process (careful!)
```

**No browser connection:**
- Install Browser MCP Firefox extension
- Click extension icon and "Connect"  
- Verify port matches (default: 9001)

**Build errors:**
```bash
npm run typecheck  # Check TypeScript errors
npm run build      # Rebuild project
```

See [Installation Guide](./docs/INSTALLATION.md) for platform-specific troubleshooting.

## 📊 Project Status

**Fixed in This Version:**
- ✅ Recursive server.close() bug resolved
- ✅ Safe port management with --force flag
- ✅ Workspace dependencies replaced with local implementations
- ✅ Full TypeScript type safety
- ✅ Comprehensive documentation added

**Architecture:**
- Clean, maintainable TypeScript codebase (~1.2k LOC)
- Hexagonal architecture with clear separation of concerns
- Comprehensive error handling and validation
- Extensible tool system for new browser capabilities

## 🏆 Credits

Browser MCP Firefox was adapted from the [Playwright MCP server](https://github.com/microsoft/playwright-mcp) to automate the user's existing browser rather than creating new instances. This enables:

- Using logged-in browser sessions
- Avoiding common bot detection mechanisms  
- Leveraging real browser fingerprints
- Maintaining user context and preferences

## 📄 License

MIT License - see LICENSE file for details.

---

**Quick Links:**
- [Complete Installation Guide](./docs/INSTALLATION.md)
- [API Reference](./docs/API.md)  
- [Architecture Details](./docs/ARCHITECTURE.md)
- [Development Setup](./docs/DEVELOPMENT.md)
- [Security Information](./docs/SECURITY.md)

For questions or support, please check the [GitHub Issues](https://github.com/browsermcp/mcp/issues).