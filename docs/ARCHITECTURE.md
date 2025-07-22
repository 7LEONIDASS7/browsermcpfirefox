# Architecture Guide

This document provides a comprehensive overview of the Browser MCP Firefox architecture, design patterns, and implementation details.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Communication Protocols](#communication-protocols)
- [Security Model](#security-model)
- [Extension Points](#extension-points)
- [Performance Characteristics](#performance-characteristics)

## System Overview

Browser MCP Firefox implements a bridge architecture that connects AI agents with browser automation capabilities through the Model Context Protocol (MCP).

```
┌─────────────────┐    stdio     ┌─────────────────┐    WebSocket    ┌─────────────────┐
│   AI Agents     │◄────────────►│  MCP Server     │◄───────────────►│ Browser Ext.    │
│ (VS Code,       │              │ (This Project)  │                 │ (Firefox)       │
│  Cursor,        │              │                 │                 │                 │
│  Claude, etc.)  │              │                 │                 │                 │
└─────────────────┘              └─────────────────┘                 └─────────────────┘
```

### Key Characteristics
- **Single Process**: Lightweight Node.js process (~1.2k LOC)
- **Protocol Bridge**: Translates MCP calls to WebSocket messages
- **Stateless Tools**: Each browser operation is an independent tool
- **Type-Safe**: Full TypeScript with runtime validation via Zod

## Architecture Patterns

### Hexagonal Architecture (Ports and Adapters)
The codebase follows hexagonal architecture principles:

```
    ┌─────────────────────────────────────────┐
    │              Core Business Logic         │
    │    ┌─────────────────────────────────┐   │
    │    │         Tools Domain            │   │
    │    │  - Navigation Tools             │   │
    │    │  - Interaction Tools            │   │
    │    │  - Information Tools            │   │
    │    └─────────────────────────────────┘   │
    │                     │                   │
    │    ┌─────────────────────────────────┐   │
    │    │         Server Core             │   │
    │    │  - Tool Registry                │   │
    │    │  - Request Routing              │   │
    │    │  - Error Handling               │   │
    │    └─────────────────────────────────┘   │
    └─────────────────────────────────────────┘
              │                     │
    ┌─────────▼─────────┐  ┌────────▼──────────┐
    │   MCP Adapter     │  │  WebSocket Adapter │
    │   (stdio)         │  │  (Browser Ext.)    │
    │ - ListTools       │  │ - Context          │
    │ - CallTool        │  │ - Message Sender   │
    │ - Resources       │  │ - Error Mapping    │
    └───────────────────┘  └───────────────────┘
```

### Factory Pattern
Tool creation uses the Factory pattern for flexible configuration:

```typescript
// ToolFactory allows snapshot configuration
export const navigate: ToolFactory = (snapshot) => ({
  schema: { /* ... */ },
  handle: async (context, params) => {
    // Execute navigation
    if (snapshot) {
      return captureAriaSnapshot(context);
    }
    // Return simple confirmation
  }
});
```

### Strategy Pattern
Different tool categories implement the same `Tool` interface:
- Navigation tools (navigate, go_back, go_forward)
- Interaction tools (wait, press_key)
- DOM manipulation tools (click, type, hover, drag)
- Information gathering tools (snapshot, screenshot, get_console_logs)

## Core Components

### 1. MCP Server (`src/server.ts`)
The central orchestrator that handles MCP protocol communication.

**Responsibilities:**
- Register tool schemas with MCP runtime
- Route incoming tool calls to appropriate handlers
- Manage WebSocket server lifecycle
- Handle resource requests (future extensibility)

**Key Methods:**
```typescript
setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: tools.map((tool) => tool.schema) };
});

setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.schema.name === request.params.name);
  return await tool.handle(context, request.params.arguments);
});
```

### 2. Context Manager (`src/context.ts`)
Manages WebSocket connections and message communication with the browser extension.

**Responsibilities:**
- WebSocket connection lifecycle
- Message serialization/deserialization
- Error translation and recovery
- Connection state management

**Key Features:**
- Single connection enforcement
- Automatic connection validation
- Typed message sending with timeout support
- Error message normalization

### 3. Tool System (`src/tools/`)
Modular tool implementations following a consistent interface.

#### Tool Interface
```typescript
interface Tool {
  schema: {
    name: string;
    description: string;
    inputSchema: JsonSchema;
  };
  handle: (context: Context, params: any) => Promise<ToolResult>;
}
```

#### Tool Categories
- **Common Tools** (`common.ts`): Basic navigation and interaction
- **Snapshot Tools** (`snapshot.ts`): DOM manipulation with ARIA snapshots
- **Custom Tools** (`custom.ts`): Screenshots and console log capture

### 4. WebSocket Server (`src/ws.ts`)
Manages the WebSocket server lifecycle and connection handling.

**Features:**
- Safe port management with collision detection
- Graceful process termination options
- Connection timeout and retry logic
- Configurable port binding

### 5. Utility Layer (`src/utils/`)
Supporting utilities for common operations.

**Components:**
- **ARIA Snapshot** (`aria-snapshot.ts`): Page accessibility tree capture
- **Port Management** (`port.ts`): Network port utilities
- **Debug Logging** (`debugLog.ts`): Non-interfering logging

## Data Flow

### Tool Execution Flow
```
1. AI Agent Request
   ├─ MCP CallTool message via stdio
   │
2. Server Processing
   ├─ Parse request parameters
   ├─ Validate against tool schema
   ├─ Find matching tool by name
   │
3. Tool Execution
   ├─ Call tool.handle(context, params)
   ├─ Send WebSocket message to extension
   ├─ Wait for response with timeout
   │
4. Response Processing
   ├─ Capture ARIA snapshot (if enabled)
   ├─ Format response content
   ├─ Return ToolResult to MCP
   │
5. AI Agent Response
   └─ Receive formatted response via stdio
```

### WebSocket Message Flow
```
Server                          Browser Extension
  │                                     │
  ├─ Send: {"type": "browser_click",    │
  │         "payload": {"element": "#btn"}}
  │                                     │
  │              Process Click          ├─
  │                                     │
  │         Response: {"success": true} ◄─
  │                                     │
  ├─ Send: {"type": "getUrl"}           │
  │                                     │
  │    Response: {"url": "https://..."} ◄─
  │                                     │
```

## Communication Protocols

### MCP Protocol Integration
Implements the Model Context Protocol for AI agent communication:

**Supported MCP Operations:**
- `ListTools`: Enumerate available browser automation tools
- `CallTool`: Execute a specific tool with parameters
- `ListResources`: List available resources (extensibility)
- `ReadResource`: Read resource content (extensibility)

**MCP Transport:**
- Uses stdio transport for AI agent communication
- Supports standard MCP error handling and responses
- Compatible with MCP SDK version 1.8.0+

### WebSocket Protocol Design
Custom protocol for browser extension communication:

**Message Structure:**
```typescript
interface Message {
  type: string;           // Message identifier
  payload: any;          // Message-specific data
  id?: string;           // Optional correlation ID
  timestamp?: number;    // Optional timestamp
}
```

**Message Categories:**
- **Navigation**: `browser_navigate`, `browser_go_back`, `browser_go_forward`
- **Interaction**: `browser_wait`, `browser_press_key`
- **DOM Manipulation**: `browser_click`, `browser_type`, `browser_hover`, etc.
- **Information**: `browser_screenshot`, `browser_get_console_logs`, `getUrl`, `getTitle`

## Security Model

### Threat Model
**Assets:**
- User's browser session and credentials
- Local system access via WebSocket
- Browser automation capabilities

**Threats:**
- Unauthorized WebSocket connections
- Malicious automation commands
- Cross-origin attacks via browser
- Local privilege escalation

### Security Controls

#### Network Security
- **Local Binding**: WebSocket server binds to localhost (127.0.0.1) only
- **No Authentication**: Relies on OS-level access control
- **No TLS**: Assumes local trusted environment

#### Process Security
- **Sandboxed Execution**: Runs with user privileges only
- **Port Isolation**: Uses dedicated WebSocket port
- **Safe Defaults**: Requires explicit `--force` for process termination

#### Browser Security
- **Extension-Based**: Requires user-installed browser extension
- **Same-Origin Policy**: Subject to browser security model
- **User Session**: Operates within user's logged-in context

### Security Recommendations

1. **Network Isolation**:
   - Use firewall to block external access to WebSocket port
   - Consider VPN or SSH tunneling for remote access
   - Monitor network connections to WebSocket port

2. **Access Control**:
   - Run server with minimal required privileges
   - Use dedicated user account for automation tasks
   - Implement session timeouts for long-running operations

3. **Audit and Monitoring**:
   - Log all tool executions and WebSocket connections
   - Monitor for unusual browser activity
   - Implement rate limiting for high-frequency operations

## Extension Points

### Adding New Tools
Create new browser automation capabilities:

```typescript
// src/tools/custom-tool.ts
export const customTool: Tool = {
  schema: {
    name: "custom_action",
    description: "Performs a custom browser action",
    inputSchema: zodToJsonSchema(CustomToolSchema.shape.arguments)
  },
  handle: async (context, params) => {
    const validatedParams = CustomToolSchema.shape.arguments.parse(params);
    await context.sendSocketMessage("browser_custom_action", validatedParams);
    return {
      content: [{ type: "text", text: "Custom action completed" }]
    };
  }
};
```

### Extending WebSocket Protocol
Add new message types for browser extension communication:

1. **Define Message Type**: Add to WebSocket message map
2. **Implement Tool**: Create tool that sends the message
3. **Update Extension**: Handle message in browser extension
4. **Add Types**: Update TypeScript definitions

### Custom Transport Layer
Replace stdio with alternative transports:

```typescript
// Example: HTTP transport
import { HttpTransport } from "@modelcontextprotocol/sdk/server/http.js";

const transport = new HttpTransport({ port: 3000 });
await server.connect(transport);
```

### Resource System Extension
Add MCP resources for additional functionality:

```typescript
interface Resource {
  schema: {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
  };
  read: (context: Context, uri: string) => Promise<ResourceContent[]>;
}
```

## Performance Characteristics

### Latency Profile
- **Tool Call Overhead**: ~10-50ms (MCP + validation)
- **WebSocket Round-trip**: ~5-20ms (local network)
- **Browser Processing**: ~50-500ms (depending on action)
- **ARIA Snapshot**: ~100-1000ms (page complexity dependent)

### Memory Usage
- **Server Process**: ~30-50MB base memory
- **Per Connection**: ~5-10MB additional
- **Tool State**: Minimal (stateless design)
- **Snapshot Caching**: None (computed on-demand)

### Scalability Limits
- **Concurrent Connections**: 1 (by design)
- **Tool Call Rate**: ~10-20 calls/second sustainable
- **WebSocket Message Size**: Limited by Node.js (default 1GB)
- **Browser Tab Limit**: Subject to browser constraints

### Performance Optimizations

1. **Selective Snapshots**: Disable ARIA snapshots for high-frequency operations
2. **Connection Pooling**: Reuse WebSocket connections where possible
3. **Message Batching**: Combine multiple operations when applicable
4. **Caching Strategy**: Cache stable page elements and selectors

### Monitoring and Observability

**Recommended Metrics:**
- Tool execution latency (p50, p95, p99)
- WebSocket connection success rate
- Error rate by tool type
- Browser extension response times

**Logging Strategy:**
- Structured logging with correlation IDs
- Tool execution traces
- WebSocket message debugging
- Performance timing data

---

For API details and usage examples, see [API.md](./API.md).
For development workflow and contributing, see [DEVELOPMENT.md](./DEVELOPMENT.md).