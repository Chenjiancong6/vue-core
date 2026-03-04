import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ElMessage } from 'element-plus'
import { msgList } from '../ai-message-list-store';
import { streamLLM } from '@/ai-lib/llm'; // 引入流式处理模块

// 流式传输消息-发送函数
export function sendStreamMsg(msg: string) {
    // 如果当前最后一条消息还未处理完毕，则禁止继续发送消息
  // 未处理完毕指的是：status != 'done'
  let lastNotDoneReplyMsg = msgList.value.findLast(item => {
    if (item.type != 'reply') {
      return false;
    }
    // 数据还在流式传输过程中，也不能继续发送消息
    if(item.status == 'stream') {
      return true;
    }
    if (item.status != 'done') {
      return true;
    }
    return false;
  });

  if(lastNotDoneReplyMsg) {
    ElMessage.error('正在处理中，请稍后.')
    return false;
  };

  const toSendMsg = msg;
  // 把用户提问的消息，添加到msgList数组对象中
  msgList.value.push({
    id: uuidv4(),
    content: toSendMsg,
    type: 'ask',
    status: 'done',
  });

  // 调用流式处理模块的chat方法，开始处理流式数据
  streamLLM.chat(toSendMsg)

  return true;
}