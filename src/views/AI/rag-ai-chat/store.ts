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
