#!/usr/bin/env node
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { program } from "commander";

import { appConfig } from "@repo/config/app.config";

import type { Resource } from "@/resources/resource";
import { createServerWithTools } from "@/server";
import * as common from "@/tools/common";
import * as custom from "@/tools/custom";
import * as snapshot from "@/tools/snapshot";
import type { Tool } from "@/tools/tool";

import packageJSON from "../package.json";

function setupExitWatchdog(server: Server) {
  process.stdin.on("close", async () => {
    setTimeout(() => process.exit(0), 15000);
    await server.close();
    process.exit(0);
  });
}

const commonTools: Tool[] = [common.pressKey, common.wait];

const customTools: Tool[] = [custom.getConsoleLogs, custom.screenshot];

const snapshotTools: Tool[] = [
  common.navigate(true),
  common.goBack(true),
  common.goForward(true),
  snapshot.snapshot,
  snapshot.click,
  snapshot.hover,
  snapshot.type,
  snapshot.selectOption,
  ...commonTools,
  ...customTools,
];

const resources: Resource[] = [];

async function createServer(options: { wsPort?: number; force?: boolean }): Promise<Server> {
  return createServerWithTools({
    name: appConfig.name,
    version: packageJSON.version,
    tools: snapshotTools,
    resources,
    wsPort: options.wsPort,
    forceKill: options.force,
  });
}

/**
 * Note: Tools must be defined *before* calling `createServer` because only declarations are hoisted, not the initializations
 */
program
  .version("Version " + packageJSON.version)
  .name(packageJSON.name)
  .option("--ws-port <port>", "WebSocket port to use", "9001")
  .option("--force", "Force kill existing processes on the specified port")
  .action(async (options) => {
    const wsPort = parseInt(options.wsPort);
    const server = await createServer({ wsPort, force: options.force });
    setupExitWatchdog(server);

    // Redirect console.log to stderr to avoid polluting MCP stdout protocol
    console.log = console.error;

    const transport = new StdioServerTransport();
    await server.connect(transport);
  });
program.parse(process.argv);
