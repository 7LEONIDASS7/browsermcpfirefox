export declare const MessageType: {
  TOOL_CALL: string;
  TOOL_RESPONSE: string;
};

export declare type MessageType<T> = keyof T;
export declare type MessagePayload<T, K extends keyof T> = T[K];