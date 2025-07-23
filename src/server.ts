import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Context } from "@/context";
import type { Resource } from "@/resources/resource";
import type { Tool } from "@/tools/tool";
import { createWebSocketServer } from "@/ws";

type Options = {
  name: string;
  version: string;
  tools: Tool[];
  resources: Resource[];
  wsPort?: number;
  forceKill?: boolean;
};

export async function createServerWithTools(options: Options): Promise<Server> {
  const { name, version, tools, resources, wsPort, forceKill } = options;
  const context = new Context();
  const server = new Server(
    { name, version },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  const wss = await createWebSocketServer(wsPort, forceKill);
  console.log(`WebSocket server listening on port ${wsPort}`);
  
  wss.on("connection", (websocket) => {
    console.log('Browser extension connected!');
    // Close any existing connections
    if (context.hasWs()) {
      console.log('Closing existing WebSocket connection');
      context.ws.close();
    }
    context.ws = websocket;
    
    websocket.on('message', (data) => {
      console.log('Message from browser extension:', data.toString());
    });
    
    websocket.on('close', (code, reason) => {
      console.log('Browser extension disconnected:', code, reason.toString());
    });
    
    websocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map((tool) => tool.schema) };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: resources.map((resource) => resource.schema) };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.log('Tool call received:', request.params.name, request.params.arguments);
    
    // Handle tool name prefix mapping (mcp__browser__navigate -> navigate)
    let toolName = request.params.name;
    const browserPrefix = "mcp__browser__";
    if (toolName.startsWith(browserPrefix)) {
      toolName = toolName.slice(browserPrefix.length);
      console.log('Stripped prefix, looking for tool:', toolName);
    }
    
    const tool = tools.find((tool) => tool.schema.name === toolName);
    if (!tool) {
      console.error('Tool not found:', request.params.name, '(mapped to:', toolName + ')');
      console.log('Available tools:', tools.map(t => t.schema.name));
      return {
        content: [
          { type: "text", text: `Tool "${request.params.name}" not found` },
        ],
        isError: true,
      };
    }

    try {
      console.log('Executing tool:', request.params.name);
      const result = await tool.handle(context, request.params.arguments);
      console.log('Tool execution success:', request.params.name);
      return result;
    } catch (error) {
      console.error('Tool execution error:', request.params.name, error);
      return {
        content: [{ type: "text", text: String(error) }],
        isError: true,
      };
    }
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const resource = resources.find(
      (resource) => resource.schema.uri === request.params.uri,
    );
    if (!resource) {
      return { contents: [] };
    }

    const contents = await resource.read(context, request.params.uri);
    return { contents };
  });

  const originalClose = server.close.bind(server);
  server.close = async () => {
    await originalClose();
    await wss.close();
    await context.close();
  };

  return server;
}
