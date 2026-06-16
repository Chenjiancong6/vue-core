
export interface AIMsg {
  id?: number | string; // 消息id
  content?: string; // 消息内容
  reasoning_content?: string; // 推理内容(思考过程)
  type?: 'ask' | 'reply'; // 消息类型
  status?: 'thinking' | 'done' | 'stream' | 'error'; // 消息状态
};

// 聊天消息列表数据格式
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'; // 角色
  content: string; // 消息内容
}
