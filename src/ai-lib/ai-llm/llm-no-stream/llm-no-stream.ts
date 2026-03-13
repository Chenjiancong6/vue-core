import Request from '@/network/chatRequest';
import { _requestData, _presendMsgObj } from '../llm-request-data-store';

/**
 * LLMNoStream 非流式处理
 * @description ai返回消息-非流式处理
 */
export class LLMNoStream {
  _apiUrl = ''; // api地址
  _model = ''; // 模型名称
  _index = 0; // 索引

  // 完整的回复回调函数
  _onResponseCallback = (msg) => {};

  constructor(option: any) {
    this._apiUrl = option.apiUrl;
    this._model = option.model;
  }

  // 响应回调
  onResponse(callback) {
    // callback是一个回调函数，赋值给this._onResponseCallback 后，this._onResponseCallback 变成了一个函数
    // 在chat 中 执行this._onResponseCallback(res);就把res 作为参数，传递给callback 函数
    this._onResponseCallback = callback;
  }

  /**
   * 大语言模型接口调用函数
   * @param {string} msg 接口参数
   * @returns 
   */
  chat(msg: string):void {
    // 合并预发送消息和请求消息
    const toSendData = {
      model: this._model,
      messages: [
        ...Object.values(_presendMsgObj),
        ..._requestData.messages,
        {
          role: 'user', // 用户发送的消息
          content: msg
        }
      ]
    };
    // 把每次发送的消息保存到栈中，在下一次调用ai 接口时，会把栈中的消息一起发送，实现多轮对话
    _requestData.messages.push({ role: 'user', content: msg });

    // 调用接口
    Request.post({
      url: this._apiUrl,
      data: toSendData,
    }).then((res:any) => {
      // console.log(res, '非流式处理-llm');
      // 把ai返回的消息保存到栈中
      _requestData.messages.push({
        role: 'assistant', // 助手发送的消息
        content: res?.choices[0]?.message?.content,
      });
      // 回调响应数据
      this._onResponseCallback({content: res?.choices[0]?.message?.content, reasoning_content: res?.choices[0]?.message?.reasoning_content, res: res});
      
      // this._index++; // 索引增加
    }).catch((err) => {
      console.error('发生未知错误，请重新输入',err);
    })
  }

  /**
   * 添加预发送消息
   */
  addPresendMsg(key: string,role: string,content: any) {
    _presendMsgObj[key] = {
      role,
      content
    }
  }

  /**
   * 清除单条预发送消息
   */
  removePresendMsg(key: string) {
    if (_presendMsgObj[key]) {
      delete _presendMsgObj[key];
    }
  }

  /**
   * 清除所有预发送消息
   */
  clearPresendMsg() {
    for(const key in _presendMsgObj) {
      delete _presendMsgObj[key];
    }
  }

  /**
   * 清空多轮对话中的历史对话消息
   */
  clearHistoryMsg() {
    _requestData.messages = [];
  }

}
