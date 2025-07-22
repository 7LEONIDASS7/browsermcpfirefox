export function createSocketMessageSender(ws) {
  return {
    send: (message) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  };
}