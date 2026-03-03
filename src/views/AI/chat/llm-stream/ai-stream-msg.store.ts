import { ref } from 'vue';
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event';
import { v4 as uuidv4 } from 'uuid';
import { AIMsg } from '@/types/message';
import { ElMessage } from 'element-plus'
import { msgList, resetMsgList } from '../ai-message-list-store';

// 流式传输消息-发送函数
function sendStreamMsg(msg: AIMsg) {
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
  }
}