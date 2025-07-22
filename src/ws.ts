import { WebSocketServer } from "ws";

import { mcpConfig } from "@repo/config/mcp.config";
import { wait } from "@repo/utils";

import { isPortInUse, killProcessOnPort } from "@/utils/port";

export async function createWebSocketServer(
  port: number = mcpConfig.defaultWsPort,
  forceKill: boolean = false,
): Promise<WebSocketServer> {
  if (await isPortInUse(port)) {
    if (forceKill) {
      console.warn(`Force killing process on port ${port}`);
      killProcessOnPort(port);
      // Wait until the port is free with timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      while (await isPortInUse(port) && attempts < maxAttempts) {
        await wait(100);
        attempts++;
      }
      if (attempts >= maxAttempts) {
        throw new Error(`Port ${port} is still in use after attempting to kill process`);
      }
    } else {
      throw new Error(`Port ${port} is already in use. Use --force flag to kill existing process.`);
    }
  }
  return new WebSocketServer({ port });
}
