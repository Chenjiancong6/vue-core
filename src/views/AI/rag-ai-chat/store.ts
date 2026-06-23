import { ref } from 'vue';
import { AIMsg, ChatMessage } from '@/types/message';

/**
 * ai聊天消息列表
 */
export const aiChatMsgList = ref<AIMsg[]>([]);

/**
 * 历史聊天数据，用于传递给ai模型，用于上下文理解
 */
export const historyChatMsgList = ref<ChatMessage[]>([]);

// 是否开启流式输出
export const hasLLMStream = ref<boolean>(true);


// RAGfolw 接口 body 配置参数
export const ragflow_URL_body_config = {
  "model": "model",
  "messages": [], // 聊天消息列表, 包含用户和助手的消息 (这里动态传入) 
  "stream": false, // 是否开启流式输出 (这里根据配置项动态传入)
  "extra_body": {
    "reference": false, // 是否开启参考引用功能
    "reference_metadata": {
      "include": true,
      "fields": [
        "author",
        "year",
        "source"
      ]
    }
  }
}