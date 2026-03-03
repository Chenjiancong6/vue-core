import Request from '@/network/chatRequest';

/**
 * LLMSteam 流式处理
 * @description ai返回消息-流式处理调用
 */

export class LLMStream {
  _apiUrl = ''; // api地址
  _model = ''; // 模型名称

  // 保存历次发送请求的参数
  _requestData = {
    messages: [],
  };

  /**
   * 有时候需要在发送消息前，预埋一些要同步发送的消息，但是后续可能会被移除掉
   * @example 例如：
   * {"role": "system","content": "你的名字叫超级大哈克"},
  */
  _presendMsgObj = {};

  constructor(option: any) {
    this._apiUrl = option.apiUrl;
    this._model = option.model;
  }

  /**
   * 调用ai 接口
   */
  chat(msg: string):void {
    // 合并预发送消息和请求消息
    const toSendData = {
      model: this._model, // 模型
      messages: [
        ...Object.values(this._presendMsgObj), // 合并预发送消息
        ...this._requestData.messages, // 传入历史对话内容（包含用户和AI的消息），实现AI理解上下文并支持多轮对话
        {
          role: 'user', // 用户发送的消息
          content: msg
        }
      ],
      "stream": true, // 开启流式处理
    };
    // 把每次发送的消息保存到栈中，在下一次调用ai 接口时，会把栈中的消息一起发送，实现多轮对话
    this._requestData.messages.push({ role: 'user', content: msg });

    // 调用接口
    Request.post({
      url: this._apiUrl,
      data: toSendData,
    }).then((res) => {
      
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 添加预发送消息
   */
  addPresendMsg(key: string, role: string, content: string):void {
    this._presendMsgObj[key] = {
      role,
      content,
    }
  }

  /**
   * 清除单条预发送消息
   */
  clearPresendMsg(key: string):void {
    if(this._presendMsgObj[key]) {
      delete this._presendMsgObj[key]
    }
  }

  /**
   * 清除所有预发送消息
   */
  clearAllPresendMsg():void {
    this._presendMsgObj = {}
  }

  /**
   * 清空多轮对话中的历史对话消息
   */
  clearHistoryMsg():void {
    this._requestData.messages = []
  }
}