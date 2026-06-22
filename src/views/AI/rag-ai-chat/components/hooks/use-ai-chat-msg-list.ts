
import { AIMsg } from '@/types/message';
import { aiChatMsgList } from '@/views/AI/rag-ai-chat/store';

/**
 * ai聊天消息列表数据添加函数
 */
export const useAiChatMsgList = () => {
  // 添加ai聊天消息
  const addAIMsg = (msg: AIMsg) => {
    aiChatMsgList.value.push(msg);
  };

  // 清空ai聊天消息
  const clearAIMsg = () => {
    aiChatMsgList.value = [];
  };
  return {
    addAIMsg,
    clearAIMsg,
  };
};
