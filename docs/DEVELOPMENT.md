# Development Guide

This guide provides detailed information for developers who want to contribute to, extend, or customize Browser MCP Firefox.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Adding New Tools](#adding-new-tools)
- [Testing](#testing)
- [Code Standards](#code-standards)
- [Debugging](#debugging)
- [Contributing](#contributing)

## Development Setup

### Prerequisites
- Node.js 18 or higher
- TypeScript 5.6+
- Firefox browser with Browser MCP extension
- Git for version control

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd browsermcpfirefox

# Install dependencies
npm install

# Build the project
npm run build

# Run type checking
npm run typecheck
```

### Development Environment
```bash
# Watch mode for development (rebuilds on changes)
npm run watch

# Run the server in development
node dist/index.js --ws-port 9001
```

## Project Structure

```
browsermcpfirefox/
├── src/                        # TypeScript source code
│   ├── tools/                  # Browser automation tools
│   │   ├── common.ts          # Basic navigation and interaction
│   │   ├── snapshot.ts        # DOM manipulation with snapshots
│   │   ├── custom.ts          # Screenshots and console logs
│   │   └── tool.ts            # Tool interface definition
│   ├── resources/             # MCP resources (future)
│   │   └── resource.ts        # Resource interface
│   ├── utils/                 # Utility functions
│   │   ├── aria-snapshot.ts   # ARIA tree capture
│   │   ├── port.ts           # Port management utilities
│   │   └── debugLog.ts       # Debug logging
│   ├── context.ts            # WebSocket context management
│   ├── server.ts             # MCP server implementation
│   ├── ws.ts                 # WebSocket server setup
│   └── index.ts              # CLI entry point
├── lib/                       # Local dependency replacements
│   ├── config/               # Configuration modules
│   ├── messaging/            # Message type definitions
│   ├── types/                # Type definitions
│   └── utils/                # Utility functions
├── docs/                     # Documentation
├── dist/                     # Built JavaScript (generated)
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # Main project documentation
```

### Key Files Explained

**Core Architecture:**
- `src/index.ts`: CLI entry point with Commander.js setup
- `src/server.ts`: MCP server with tool registration and routing
- `src/context.ts`: WebSocket connection management and message passing
- `src/ws.ts`: WebSocket server lifecycle and port management

**Tool System:**
- `src/tools/tool.ts`: Base interface for all tools
- `src/tools/common.ts`: Navigation and basic interaction tools
- `src/tools/snapshot.ts`: DOM manipulation tools with ARIA snapshots
- `src/tools/custom.ts`: Special-purpose tools (screenshots, console logs)

**Supporting Infrastructure:**
- `src/utils/aria-snapshot.ts`: Page accessibility tree capture
- `lib/`: Local implementations of workspace dependencies
- `tsconfig.json`: TypeScript compiler configuration with path mapping

## Development Workflow

### Standard Development Cycle
1. **Make Changes**: Edit TypeScript source files in `src/`
2. **Type Check**: Run `npm run typecheck` to validate TypeScript
3. **Build**: Run `npm run build` to compile to JavaScript
4. **Test**: Run the server and test with browser extension
5. **Debug**: Use browser dev tools and server logs

### Hot Reload Development
```bash
# Terminal 1: Watch mode (auto-rebuilds on changes)
npm run watch

# Terminal 2: Run server (restart manually after rebuilds)
node dist/index.js --ws-port 9001
```

### Testing Changes
1. **Unit Testing**: Currently minimal - opportunity for contribution
2. **Integration Testing**: Test with actual browser extension
3. **Manual Testing**: Use MCP inspector or AI agent integration

```bash
# Use MCP inspector for testing
CLIENT_PORT=9001 SERVER_PORT=9002 npx @modelcontextprotocol/inspector node dist/index.js
```

## Adding New Tools

### Step-by-Step Guide

#### 1. Define the Tool Schema
Create a Zod schema in `lib/types/mcp/tool.js`:

```javascript
export const MyCustomTool = z.object({
  name: z.literal('my_custom_tool'),
  description: z.literal('Description of what this tool does'),
  arguments: z.object({
    parameter1: z.string().describe('Description of parameter1'),
    parameter2: z.number().optional().describe('Optional parameter2')
  })
});
```

#### 2. Add TypeScript Declaration
Add to `lib/types/mcp/tool.d.ts`:

```typescript
export declare const MyCustomTool: z.ZodObject<any>;
```

#### 3. Implement the Tool
Create or add to a file in `src/tools/`:

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";
import { MyCustomTool } from "@repo/types/mcp/tool";
import type { Tool } from "./tool";

export const myCustomTool: Tool = {
  schema: {
    name: MyCustomTool.shape.name.value,
    description: MyCustomTool.shape.description.value,
    inputSchema: zodToJsonSchema(MyCustomTool.shape.arguments),
  },
  handle: async (context, params) => {
    // Validate parameters
    const validatedParams = MyCustomTool.shape.arguments.parse(params);
    
    // Send WebSocket message to browser extension
    const result = await context.sendSocketMessage("browser_my_custom_action", {
      param1: validatedParams.parameter1,
      param2: validatedParams.parameter2
    });
    
    // Return formatted response
    return {
      content: [
        {
          type: "text",
          text: `Custom tool executed with result: ${JSON.stringify(result)}`
        }
      ]
    };
  }
};
```

#### 4. Register the Tool
Add to the appropriate tool array in `src/index.ts`:

```typescript
import { myCustomTool } from "@/tools/custom";

const customTools: Tool[] = [
  // ... existing tools
  myCustomTool
];
```

#### 5. Update Browser Extension
The browser extension must handle the new WebSocket message type `browser_my_custom_action`.

### Tool Development Best Practices

#### Input Validation
Always validate parameters using Zod schemas:

```typescript
handle: async (context, params) => {
  const validatedParams = MyToolSchema.shape.arguments.parse(params);
  // Zod will throw if validation fails, automatically returning an error response
}
```

#### Error Handling
Let the server handle errors - just throw descriptive errors:

```typescript
handle: async (context, params) => {
  if (someCondition) {
    throw new Error("Descriptive error message for the user");
  }
  // Normal execution
}
```

#### Consistent Response Format
Always return content in the standard format:

```typescript
return {
  content: [
    { type: "text", text: "Status message" },
    // Optional additional content
  ]
};
```

#### WebSocket Message Naming
Follow the naming convention:
- `browser_*` for actions that modify browser state
- `get*` for read-only information retrieval
- Use snake_case for message names
- Be descriptive but concise

## Testing

### Manual Testing Setup
1. **Start the Server**:
   ```bash
   node dist/index.js --ws-port 9001
   ```

2. **Connect Browser Extension**:
   - Open Firefox
   - Click Browser MCP extension icon
   - Click "Connect"

3. **Test with MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

### Integration Testing
Test tool integration with AI agents:

```bash
# Test with Claude Code or similar MCP client
# Configure the client to use this server as an MCP provider
```

### Automated Testing (Future Enhancement)
Opportunity for contribution:

```typescript
// Example test structure (not currently implemented)
describe('Navigation Tools', () => {
  test('navigate tool should send correct WebSocket message', async () => {
    const mockContext = createMockContext();
    const result = await navigate.handle(mockContext, { url: 'https://example.com' });
    expect(mockContext.sendSocketMessage).toHaveBeenCalledWith(
      'browser_navigate', 
      { url: 'https://example.com' }
    );
  });
});
```

## Code Standards

### TypeScript Standards
- **Strict Mode**: All TypeScript strict checks enabled
- **Explicit Types**: Prefer explicit over inferred types for public APIs
- **No `any`**: Avoid `any` type except for external library interfaces
- **Runtime Validation**: Use Zod for all external inputs

### Code Style
- **ES2022 Target**: Use modern JavaScript features
- **ESM Modules**: Strict ES module usage
- **Consistent Naming**: camelCase for variables, PascalCase for types
- **Path Aliases**: Use `@/` for src imports, `@repo/` for lib imports

### File Organization
```typescript
// File header order:
// 1. External imports
import { zodToJsonSchema } from "zod-to-json-schema";

// 2. Internal imports from lib
import { SomeTool } from "@repo/types/mcp/tool";

// 3. Internal imports from src
import type { Context } from "@/context";
import { someUtility } from "@/utils/helper";

// 4. Type definitions
type LocalType = { /* ... */ };

// 5. Implementation
export const toolImplementation: Tool = { /* ... */ };
```

### Error Handling Patterns
```typescript
// Good: Let errors propagate to be handled by server
handle: async (context, params) => {
  const validated = Schema.parse(params); // May throw
  const result = await context.sendSocketMessage(type, payload); // May throw
  return formatResponse(result);
}

// Good: Throw descriptive errors for user feedback
handle: async (context, params) => {
  if (!someRequirement) {
    throw new Error("Clear message explaining what went wrong and how to fix it");
  }
}

// Avoid: Catching and swallowing errors
handle: async (context, params) => {
  try {
    // ... some operation
  } catch (error) {
    return { content: [{ type: "text", text: "Something went wrong" }] };
    // Better to let the error propagate with context
  }
}
```

## Debugging

### Server-Side Debugging
```bash
# Enable debug logging
DEBUG=* node dist/index.js

# Use Node.js inspector
node --inspect dist/index.js
# Then connect Chrome DevTools to localhost:9229
```

### WebSocket Message Debugging
Add temporary logging to `src/context.ts`:

```typescript
async sendSocketMessage(type: string, payload: any) {
  console.log(`Sending WebSocket message: ${type}`, payload);
  const result = await this.messageSender.sendSocketMessage(type, payload);
  console.log(`Received WebSocket response:`, result);
  return result;
}
```

### Browser Extension Debugging
1. Open Firefox Developer Tools
2. Go to about:debugging
3. Find Browser MCP extension
4. Click "Inspect" to open extension DevTools
5. Monitor console logs and WebSocket messages

### Common Debug Scenarios

#### Tool Not Found
```
Error: Tool "my_tool" not found
```
- Check tool is imported in `src/index.ts`
- Verify tool name matches exactly in schema
- Ensure tool is added to the appropriate tool array

#### WebSocket Connection Issues
```
No connection to browser extension...
```
- Verify extension is installed and enabled
- Check WebSocket port matches between server and extension
- Confirm no firewall blocking the port

#### Parameter Validation Errors
```
ZodError: Invalid input
```
- Check parameter types match schema definition
- Verify required parameters are provided
- Ensure parameter names match exactly

## Contributing

### Pull Request Process
1. **Fork the Repository**: Create your own fork
2. **Create Feature Branch**: `git checkout -b feature/my-new-tool`
3. **Make Changes**: Follow development workflow
4. **Test Thoroughly**: Manual testing with browser extension
5. **Update Documentation**: Add or update relevant docs
6. **Submit PR**: Clear description of changes and testing performed

### Code Review Checklist
- [ ] TypeScript compiles without errors
- [ ] New tools have proper Zod schemas
- [ ] Error handling follows established patterns
- [ ] Documentation updated for new features
- [ ] Manual testing performed
- [ ] No breaking changes to existing APIs

### Contributing Ideas
**High Impact Contributions:**
- Unit test framework and test coverage
- Additional browser automation tools
- Security hardening (authentication, TLS)
- Performance monitoring and metrics
- Multi-browser support (Chrome, Safari)

**Documentation Contributions:**
- More usage examples
- Video tutorials
- Integration guides for specific AI agents
- Troubleshooting scenarios

**Infrastructure Contributions:**
- CI/CD pipeline setup
- Automated testing framework
- Docker container support
- Homebrew formula or similar packaging

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Code Review**: Tag maintainers for feedback on complex changes
- **Architecture Questions**: Open discussion issues for design decisions

---

For API reference and usage examples, see [API.md](./API.md).
For architectural details, see [ARCHITECTURE.md](./ARCHITECTURE.md).