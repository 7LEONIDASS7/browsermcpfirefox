export declare function createSocketMessageSender<T>(ws: any): {
  sendSocketMessage<K extends keyof T>(type: K, payload: T[K], options?: { timeoutMs?: number }): Promise<any>;
};