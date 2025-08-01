
export interface AIMsg {
  id?: number | string; // 消息id
  content?: string; // 消息内容
  type?: 'ask' | 'reply'; // 消息类型
  status?: 'thinking' | 'done' | 'error'; // 消息状态
};
