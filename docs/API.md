# API Documentation

This document provides comprehensive API documentation for all browser automation tools available in Browser MCP Firefox.

## Table of Contents

- [Overview](#overview)
- [Tool Interface](#tool-interface)
- [Navigation Tools](#navigation-tools)
- [Interaction Tools](#interaction-tools)
- [DOM Manipulation Tools](#dom-manipulation-tools)
- [Information Gathering Tools](#information-gathering-tools)
- [Error Handling](#error-handling)
- [WebSocket Protocol](#websocket-protocol)
- [Examples](#examples)

## Overview

Browser MCP Firefox exposes browser automation capabilities through a set of tools that communicate via WebSocket with a browser extension. Each tool follows a consistent interface pattern with JSON schema validation and structured responses.

### Prerequisites
- Active WebSocket connection to browser extension
- Browser extension installed and connected
- MCP server running and listening

## Tool Interface

All tools implement the following interface:

```typescript
interface Tool {
  schema: {
    name: string;
    description: string;
    inputSchema: JsonSchema;
  };
  handle: (context: Context, params: any) => Promise<ToolResult>;
}

interface ToolResult {
  content: Content[];
  isError?: boolean;
}

interface Content {
  type: "text" | "image";
  text?: string;           // for type: "text"
  data?: string;           // for type: "image" (base64)
  mimeType?: string;       // for type: "image"
}
```

## Navigation Tools

### navigate
Navigate to a specific URL.

**Parameters:**
- `url` (string, required): Target URL to navigate to

**Example Request:**
```json
{
  "name": "navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Navigated to https://example.com"
    }
  ]
}
```

**WebSocket Message:** `browser_navigate`

---

### go_back
Navigate back in browser history.

**Parameters:** None

**Example Request:**
```json
{
  "name": "go_back",
  "arguments": {}
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Navigated back"
    }
  ]
}
```

**WebSocket Message:** `browser_go_back`

---

### go_forward
Navigate forward in browser history.

**Parameters:** None

**Example Request:**
```json
{
  "name": "go_forward",
  "arguments": {}
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Navigated forward"
    }
  ]
}
```

**WebSocket Message:** `browser_go_forward`

## Interaction Tools

### wait
Pause execution for a specified duration.

**Parameters:**
- `time` (number, required): Time to wait in seconds

**Example Request:**
```json
{
  "name": "wait",
  "arguments": {
    "time": 3
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Waited for 3 seconds"
    }
  ]
}
```

**WebSocket Message:** `browser_wait`

---

### press_key
Simulate pressing a keyboard key.

**Parameters:**
- `key` (string, required): Key to press (e.g., "Enter", "Escape", "Tab")

**Example Request:**
```json
{
  "name": "press_key",
  "arguments": {
    "key": "Enter"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Pressed key Enter"
    }
  ]
}
```

**WebSocket Message:** `browser_press_key`

## DOM Manipulation Tools

### click
Click on a specified element. Automatically captures ARIA snapshot after click.

**Parameters:**
- `element` (string, required): Element selector or identifier

**Example Request:**
```json
{
  "name": "click",
  "arguments": {
    "element": "#submit-button"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Clicked \"#submit-button\""
    },
    {
      "type": "text",
      "text": "Page snapshot:\\n<yaml content>"
    }
  ]
}
```

**WebSocket Message:** `browser_click`

---

### hover
Hover over a specified element. Automatically captures ARIA snapshot after hover.

**Parameters:**
- `element` (string, required): Element selector or identifier

**Example Request:**
```json
{
  "name": "hover",
  "arguments": {
    "element": "#menu-item"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Hovered over \"#menu-item\""
    },
    {
      "type": "text",
      "text": "Page snapshot:\\n<yaml content>"
    }
  ]
}
```

**WebSocket Message:** `browser_hover`

---

### type
Type text into a specified input element. Automatically captures ARIA snapshot after typing.

**Parameters:**
- `element` (string, required): Input element selector or identifier
- `text` (string, required): Text to type

**Example Request:**
```json
{
  "name": "type",
  "arguments": {
    "element": "#email",
    "text": "user@example.com"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Typed \"user@example.com\" into \"#email\""
    },
    {
      "type": "text",
      "text": "Page snapshot:\\n<yaml content>"
    }
  ]
}
```

**WebSocket Message:** `browser_type`

---

### drag
Drag an element from one location to another. Automatically captures ARIA snapshot after drag.

**Parameters:**
- `startElement` (string, required): Source element selector
- `endElement` (string, required): Target element selector

**Example Request:**
```json
{
  "name": "drag",
  "arguments": {
    "startElement": "#item1",
    "endElement": "#dropzone"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Dragged \"#item1\" to \"#dropzone\""
    },
    {
      "type": "text",
      "text": "Page snapshot:\\n<yaml content>"
    }
  ]
}
```

**WebSocket Message:** `browser_drag`

---

### select_option
Select an option from a dropdown or list. Automatically captures ARIA snapshot after selection.

**Parameters:**
- `element` (string, required): Select element selector
- `option` (string, required): Option value to select

**Example Request:**
```json
{
  "name": "select_option",
  "arguments": {
    "element": "#country-select",
    "option": "USA"
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Selected option in \"#country-select\""
    },
    {
      "type": "text",
      "text": "Page snapshot:\\n<yaml content>"
    }
  ]
}
```

**WebSocket Message:** `browser_select_option`

## Information Gathering Tools

### snapshot
Capture the current page's ARIA snapshot.

**Parameters:** None

**Example Request:**
```json
{
  "name": "snapshot",
  "arguments": {}
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Page snapshot:\\nurl: https://example.com\\ntitle: Example Page\\n<yaml accessibility tree>"
    }
  ]
}
```

**WebSocket Messages:** `getUrl`, `getTitle`, `browser_snapshot`

---

### screenshot
Take a screenshot of the current browser viewport.

**Parameters:** None

**Example Request:**
```json
{
  "name": "screenshot",
  "arguments": {}
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "image",
      "data": "<base64-encoded-png-data>",
      "mimeType": "image/png"
    }
  ]
}
```

**WebSocket Message:** `browser_screenshot`

---

### get_console_logs
Retrieve the browser's console logs.

**Parameters:** None

**Example Request:**
```json
{
  "name": "get_console_logs",
  "arguments": {}
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"level\":\"info\",\"message\":\"Page loaded\"}\\n{\"level\":\"error\",\"message\":\"Script error\"}"
    }
  ]
}
```

**WebSocket Message:** `browser_get_console_logs`

## Error Handling

### Common Errors

#### No Connection Error
```json
{
  "content": [
    {
      "type": "text",
      "text": "No connection to browser extension. In order to proceed, you must first connect a tab by clicking the Browser MCP extension icon in the browser toolbar and clicking the 'Connect' button."
    }
  ],
  "isError": true
}
```

#### Tool Not Found Error
```json
{
  "content": [
    {
      "type": "text",
      "text": "Tool \"unknown_tool\" not found"
    }
  ],
  "isError": true
}
```

#### Validation Error
When parameters don't match the expected schema, Zod validation will throw an error that gets caught and returned:

```json
{
  "content": [
    {
      "type": "text",
      "text": "ZodError: Invalid input parameters"
    }
  ],
  "isError": true
}
```

### Error Handling Best Practices

1. **Check `isError` flag**: Always check if the response contains an error
2. **Handle connection errors**: Implement retry logic for WebSocket disconnections
3. **Validate parameters**: Ensure parameters match the expected schema before sending
4. **Graceful degradation**: Provide fallback behavior when tools fail

## WebSocket Protocol

### Message Format
All WebSocket messages follow this structure:
```json
{
  "type": "<message_type>",
  "payload": { /* message-specific data */ }
}
```

### Message Types

| Message Type | Direction | Purpose | Payload |
|--------------|-----------|---------|---------|
| `browser_navigate` | Server → Extension | Navigate to URL | `{url: string}` |
| `browser_go_back` | Server → Extension | Go back | `{}` |
| `browser_go_forward` | Server → Extension | Go forward | `{}` |
| `browser_wait` | Server → Extension | Wait | `{time: number}` |
| `browser_press_key` | Server → Extension | Press key | `{key: string}` |
| `browser_click` | Server → Extension | Click element | `{element: string}` |
| `browser_hover` | Server → Extension | Hover element | `{element: string}` |
| `browser_type` | Server → Extension | Type text | `{element: string, text: string}` |
| `browser_drag` | Server → Extension | Drag element | `{startElement: string, endElement: string}` |
| `browser_select_option` | Server → Extension | Select option | `{element: string, option: string}` |
| `browser_snapshot` | Server → Extension | Get snapshot | `{}` |
| `browser_screenshot` | Server → Extension | Take screenshot | `{}` |
| `browser_get_console_logs` | Server → Extension | Get logs | `{}` |
| `getUrl` | Server → Extension | Get current URL | `{}` |
| `getTitle` | Server → Extension | Get page title | `{}` |

### Connection Management
- Server listens on WebSocket port (default: 9001)
- Only one browser connection allowed at a time
- New connections close existing ones
- Connection errors propagate to tool responses

## Examples

### Complete Workflow Example
```javascript
// 1. Navigate to a website
await callTool("navigate", { url: "https://login.example.com" });

// 2. Take a screenshot to see the page
await callTool("screenshot", {});

// 3. Fill out a login form
await callTool("type", { element: "#username", text: "myuser" });
await callTool("type", { element: "#password", text: "mypass" });

// 4. Click the login button
await callTool("click", { element: "#login-button" });

// 5. Wait for navigation to complete
await callTool("wait", { time: 2 });

// 6. Capture the final state
await callTool("snapshot", {});
```

### Error Handling Example
```javascript
async function safeToolCall(toolName, params) {
  try {
    const result = await callTool(toolName, params);
    
    if (result.isError) {
      console.error(`Tool error: ${result.content[0].text}`);
      return null;
    }
    
    return result;
  } catch (error) {
    console.error(`Exception: ${error.message}`);
    return null;
  }
}
```

### Snapshot Analysis Example
```javascript
// Take a snapshot and analyze the page structure
const snapshot = await callTool("snapshot", {});
const snapshotText = snapshot.content[0].text;

// The snapshot contains YAML structure like:
// url: https://example.com
// title: Example Page  
// content:
//   - type: text
//     text: "Welcome"
//   - type: button
//     text: "Click me"
//     role: "button"

console.log("Current page:", snapshotText);
```

## Performance Considerations

### Snapshot Operations
- DOM manipulation tools automatically capture ARIA snapshots
- Snapshots add latency to operations (~100-500ms)
- Consider disabling snapshots for high-frequency operations
- Large pages may produce large snapshot data

### WebSocket Communication
- Each tool call requires a WebSocket round-trip
- Network latency affects performance
- Connection errors require reconnection time
- Batch operations when possible

### Resource Usage
- Screenshots are base64-encoded and can be large
- Console logs accumulate and may contain sensitive data
- Multiple rapid operations may overwhelm the browser
- Consider rate limiting for production use

---

For architectural details and development information, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPMENT.md](./DEVELOPMENT.md).