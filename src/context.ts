import { createSocketMessageSender } from "@r2r/messaging/ws/sender";
import { WebSocket } from "ws";

import { mcpConfig } from "@repo/config/mcp.config";
import { MessagePayload, MessageType } from "@repo/messaging/types";
import { SocketMessageMap } from "@repo/types/messages/ws";

const noConnectionMessage = `No connection to browser extension. In order to proceed, you must first connect a tab by clicking the Browser MCP extension icon in the browser toolbar and clicking the 'Connect' button.`;

export class Context {
  private _ws: WebSocket | undefined;

  get ws(): WebSocket {
    if (!this._ws) {
      throw new Error(noConnectionMessage);
    }
    return this._ws;
  }

  set ws(ws: WebSocket) {
    this._ws = ws;
  }

  hasWs(): boolean {
    return !!this._ws;
  }

  async sendSocketMessage<T extends MessageType<SocketMessageMap>>(
    type: T,
    payload: MessagePayload<SocketMessageMap, T>,
    options: { timeoutMs?: number } = { timeoutMs: 30000 },
  ) {
    console.log('Context.sendSocketMessage called:', { type, payload, hasWs: !!this._ws });
    
    const sender = createSocketMessageSender<SocketMessageMap>(this.ws);
    console.log('Created sender:', { hasSendSocketMessage: typeof sender.sendSocketMessage });
    
    const { sendSocketMessage } = sender;
    console.log('Extracted sendSocketMessage:', { type: typeof sendSocketMessage });
    
    try {
      console.log('Calling sendSocketMessage...');
      const result = await sendSocketMessage(type, payload, options);
      console.log('sendSocketMessage success:', result);
      return result;
    } catch (e) {
      console.error('sendSocketMessage error:', e);
      if (e instanceof Error && e.message === mcpConfig.errors.noConnectedTab) {
        throw new Error(noConnectionMessage);
      }
      throw e;
    }
  }

  async close() {
    if (!this._ws) {
      return;
    }
    await this._ws.close();
  }
}
