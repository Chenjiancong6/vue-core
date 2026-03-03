
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event';
import { AIMsg } from '@/types/message';
/**
 * 处理 AI 模型返回的消息
 * ai返回的消息，无论是流式还是正常的数据，这里都能拿到
 * 这个函数主要处理一些通用的ai处理方法
 */

export class AIMsgHandler {
  _noStreamLLM = null;

  // 处理 AI 模型返回的消息
  _messageSendCallback = async(msg: string) => {
    console.log('处理 AI 模型返回的消息', msg);

    // 先添加一条消息，状态为thinking,这时的currentChatMsgObj已经被赋值了id 属性
    let currentChatMsgObj: AIMsg = await this.appendMessage({
      status: "thinking",
    });
    console.log('currentChatMsgObjcurrentChatMsgObj',currentChatMsgObj);
    
    // 这里通过回到函数的方法，noStreamLLM实例中在拿到ai返回的消息
    this._noStreamLLM.onResponse(({content, res})=> {
      console.log(content,'responseMsg----',res);
      // 这里更新消息状态为done
      this.updateMessage({
        id: currentChatMsgObj.id,
        content: content || '',
        status: 'done',
        type: 'reply',
      })
    })
    // 这里发送消息
    this._noStreamLLM?.chat(msg);
  };

  constructor(option: any) {
    this._noStreamLLM = option.noStreamLLM;

    // 监听全局的消息发送事件
    useEmitt(Event.MESSAGE_SEND,(msg) => {
      this._messageSendCallback(msg);
    })
  }




  /**
   * 添加一条消息
   * 下面的运行逻辑是：
   * 1. emitter.emit(Event.APPEND_MESSAGE, msg); 触发全局事件，在ai-msg-store中的函数_handleAppendMessage接收数据
   * 2. _handleAppendMessage 函数中，会触发全局事件 Event.APPEND_MESSAGE_SUCCESS，并将添加的消息对象返回
   * 3. emitter.on(Event.APPEND_MESSAGE_SUCCESS, handleAppendMessageSuccess)接收事件，并触发handleAppendMessageSuccess函数，
   *    并将返回的消息对象赋值给newMsgObj
   * 4. resolve(newMsgObj); 触发promise的resolve函数，将newMsgObj返回
   * 5. 最终，执行let data = this.appendMessage(msg); 会返回一个promise对象，并将data赋值为newMsgObj
   * 
   */
  appendMessage(msgObj: AIMsg) {
    return new Promise((resolve)=> {
      const handleAppendMessageSuccess = (newMsgObj: AIMsg) => {
        resolve(newMsgObj); // resolve 会返回一个promise对象
        emitter.off(Event.APPEND_MESSAGE_SUCCESS, handleAppendMessageSuccess);
      }
      // 接收从ai-msg-store 发动的全局事件，并拿到返回的消息对象
      emitter.on(Event.APPEND_MESSAGE_SUCCESS, handleAppendMessageSuccess);

      // 先添加消息,在ai-msg-store中触发
      emitter.emit(Event.APPEND_MESSAGE, msgObj);
    })
  };

  /**
   * 更新一条数据
   * 运行逻辑：
   * 1. emitter.emit(Event.UPDATE_MESSAGE, msg); 触发全局事件，在ai-msg-store中的函数_handleUpdateMessage接收数据
   * 2. _handleUpdateMessage 函数中，会触发全局事件 Event.UPDATE_MESSAGE_SUCCESS，并将更新的消息对象返回
   * 3. emitter.on(Event.UPDATE_MESSAGE_SUCCESS, handleUpdateMessageSuccess)接收事件，并触发handleUpdateMessageSuccess函数，
   *    并将返回的消息对象赋值给newMsgObj
   * 4. resolve(newMsgObj); 触发promise的resolve函数，将newMsgObj返回
   * 5. 最终，执行let data = this.updateMessage(msg); 会返回一个promise对象，并将data赋值为newMsgObj
   */
    updateMessage(msg: AIMsg): Promise<AIMsg> {
    return new Promise(resolve => {
      const handleUpdateMessageSuccess = (newMsgObj: AIMsg) => {
        resolve(newMsgObj);
        emitter.off(Event.UPDATE_MESSAGE_SUCCESS, handleUpdateMessageSuccess)
      }
      emitter.on(Event.UPDATE_MESSAGE_SUCCESS, handleUpdateMessageSuccess)

      emitter.emit(Event.UPDATE_MESSAGE, msg);
    })
  }
}
