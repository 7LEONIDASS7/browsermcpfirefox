export function createSocketMessageSender(ws) {
  return {
    sendSocketMessage: async (type, payload, options = { timeoutMs: 30000 }) => {
      return new Promise((resolve, reject) => {
        if (ws.readyState !== 1) { // WebSocket.OPEN = 1
          console.log('WebSocket not ready, readyState:', ws.readyState);
          reject(new Error('WebSocket is not connected'));
          return;
        }
        console.log('WebSocket is ready, sending message:', type);

        const messageId = Math.random().toString(36).substr(2, 9);
        const message = {
          id: messageId,
          type: type,
          payload: payload
        };

        // Set up timeout
        const timeout = setTimeout(() => {
          reject(new Error(`WebSocket message timeout after ${options.timeoutMs}ms`));
        }, options.timeoutMs);

        // Set up response listener
        const responseHandler = (event) => {
          try {
            const response = JSON.parse(event.data);
            if (response.id === messageId) {
              clearTimeout(timeout);
              ws.removeEventListener('message', responseHandler);
              
              if (response.error) {
                reject(new Error(response.error));
              } else {
                resolve(response.response);
              }
            }
          } catch (e) {
            // Ignore parsing errors for other messages
          }
        };

        ws.addEventListener('message', responseHandler);

        // Send the message
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          clearTimeout(timeout);
          ws.removeEventListener('message', responseHandler);
          reject(error);
        }
      });
    }
  };
}