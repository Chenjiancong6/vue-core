import { ref } from 'vue';
import { AIMsg } from '@/types/message';

/**
 * msgList: 用户提问的数据和AI回复的数据保存在这个数组对象中
 */
export const msgList = ref<AIMsg[]>([]);

export const resetMsgList = () => {
  msgList.value = [];
}