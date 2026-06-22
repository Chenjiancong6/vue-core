import { ChatMessage } from '@/types/message';
import { historyChatMsgList } from '@/views/AI/rag-ai-chat/store';

/**
 * 历史聊天数据，用于传递给ai模型，用于上下文理解
 */
export const useHistoryChatMsgList = () => {
  // 添加历史聊天消息
  const addHistoryChatMsg = (msg: ChatMessage) => {
    historyChatMsgList.value.push(msg);
  };

  // 清空历史聊天消息
  const clearHistoryChatMsg = () => {
    historyChatMsgList.value = [];
  };

  return {
    addHistoryChatMsg,
    clearHistoryChatMsg,
  };
};