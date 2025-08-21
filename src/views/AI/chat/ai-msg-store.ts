
import { ref } from 'vue';
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event';
import { v4 as uuidv4 } from 'uuid';
import { AIMsg } from '@/types/message';
import { ElMessage } from 'element-plus'

/**
 * msgList: 用户提问的数据和AI回复的数据保存在这个数组对象中
 */
export const msgList = ref<AIMsg[]>([]);

export const resetMsgList = () => {
  msgList.value = [];
}

/**
 * 发送消息,每次输入问题后发送前，都会调用这个函数
 * 这里处理的逻辑是把用户提问的消息，添加到msgList数组对象中
 * @param msg 消息内容
 */
export const sendMessage = (msg?) => {
  // 如果当前最后一条消息还未处理完毕，则禁止继续发送消息
  // 未处理完毕指的是：status != 'done'
  let lastNotDoneReplyMsg = msgList.value.findLast(item => {
    if (item.type != 'reply') {
      return false;
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

  const toSendMsg = msg;
  // 把用户提问的消息，添加到msgList数组对象中
  msgList.value.push({
    id: uuidv4(),
    content: toSendMsg,
    type: 'ask',
    status: 'done',
  });
  
  // 给全局事件发送消息，调用ai模型
  emitter.emit(Event.MESSAGE_SEND, toSendMsg);

  return true;
};
/**
 * 添加一条消息,获取数据
 * @param msgObj 消息内容
 * 这里的status 为 'thinking'
 */
const _handleAppendMessage = (msgObj: AIMsg) => {
  const msgObjId = uuidv4();
  const newMsgObj: AIMsg = {
    id: msgObjId,
    content: msgObj?.type || '',
    type: msgObj.type || 'reply',
    status: 'thinking',
  }
  msgList.value.push(newMsgObj);

  // 发送调用成功的消息，调用ai模型
  emitter.emit(Event.APPEND_MESSAGE_SUCCESS, newMsgObj);
}

/**
 * 处理ai返回数据后，更新消息
 * @param msgObj 消息内容
 */
const _handleUpdateMessage = (msgObj: AIMsg) => {
  const msgObjId = msgObj.id;
  // 根据id,找到msgList数组对象中对应的消息
  const msgObjIndex = msgList.value.findIndex(item => item.id == msgObjId);

  const beforeUpdateMsg = msgList.value.find((msg) => {
    return msg.id == msgObj.id;
  });
  const newMsgObj = {
    ...beforeUpdateMsg,
    ...msgObj
  };

  // 覆盖数据
  msgList.value[msgObjIndex] = newMsgObj;

  // 发送调用成功的消息，调用ai模型； 在emitter.on(Event.UPDATE_MESSAGE_SUCCESS, fn)中改变status为'done'
  emitter.emit(Event.UPDATE_MESSAGE_SUCCESS, newMsgObj);
  
} 

/**
 * 初始化调用ai模型,使用emitter 监听事件,实现全局调用
 * 添加一条消息：这时候ai 还没返回数据，创建的对象数据只有id 和 status为 'thinking'
 * 更新一条消息： ai 返回数据后，根据id 找到msgList数组对象中对应的消息，更新content和status
 * _handleUpdateMessage: 在全局emitter.emit(Event.UPDATE_MESSAGE, 'xxx') 调用时，会触发这个函数
 * _handleAppendMessage: 在全局emitter.emit(Event.APPEND_MESSAGE, 'xxx') 调用时，会触发这个函数
 */
export const initStore = () => {
  emitter.on(Event.APPEND_MESSAGE, _handleAppendMessage);
  emitter.on(Event.UPDATE_MESSAGE, _handleUpdateMessage);
}

/**
 * 重置store
 */
export const resetStore = () => {
  msgList.value = [];
  emitter.off(Event.APPEND_MESSAGE, _handleAppendMessage);
  emitter.off(Event.UPDATE_MESSAGE, _handleUpdateMessage);
}