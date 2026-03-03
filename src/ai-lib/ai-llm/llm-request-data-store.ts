
import { reactive, ref } from 'vue';

// 历史对话内容（包含用户和AI的消息），实现AI理解上下文并支持多轮对话
export const _requestData = reactive({
  messages: [],
});

/**
 * 有时候需要在发送消息前，预埋一些要同步发送的消息
 * @example 例如：
 * {"role": "system","content": "你的名字叫超级大哈克"},
*/
export const _presendMsgObj = {};
