import Request from '@/network/chatRequest';
import { _requestData, _presendMsgObj } from '../llm-request-data-store';
import { v4 as uuidv4 } from 'uuid';
import { msgList } from '@/views/AI/chat/ai-message-list-store'
import { getSelectedModel } from '@/ai-lib/ai-api-keys/persistence';
import { getApiKeys } from '@/ai-lib/ai-api-keys/api-keys';

let apiKeys = getApiKeys();

/**
 * LLMSteam 流式处理
 * @description ai返回消息-流式处理调用
 */

export class LLMStream {
  _apiUrl = ''; // api地址
  _model = ''; // 模型名称

  constructor(option: any) {
    this._apiUrl = option.apiUrl;
    this._model = option.model;
  }

  /**
   * 调用ai 接口
   */
  async chat(msg: string): Promise<void> {
    // 生成唯一id
    const _uuId = uuidv4();
    let streamContent = '';
    let reasoning_content = ''; //  reasoning_content 用于存储模型的推理内容(思考过程)
    // 在msgList数组中，找到id等于_uuId的消息，把它的status设置为done

    // 合并预发送消息和请求消息
    const toSendData = {
      model: this._model, // 模型
      messages: [
        ...Object.values(_presendMsgObj), // 合并预发送消息
        ..._requestData.messages, // 传入历史对话内容（包含用户和AI的消息），实现AI理解上下文并支持多轮对话
        {
          role: 'user', // 用户发送的消息
          content: msg
        }
      ],
      "stream": true, // 开启流式处理
    };
    // 把每次发送的消息保存到栈中，在下一次调用ai 接口时，会把栈中的消息一起发送，实现多轮对话
    _requestData.messages.push({ role: 'user', content: msg });

    // 调用接口前，生成一条除以thinging状态的消息，用于展示在界面上
    msgList.value.push({
      id: _uuId,
      status: 'thinking',
    });

    // 根据id,找到msgList数组对象中对应的消息
    const msgObjIndex = msgList.value.findIndex(item => item.id == _uuId);

    try {
      // 先从缓存中获取选中的模型
      let llmCache = getSelectedModel();
      let _URL = '';
      if(llmCache) {
        _URL = `${llmCache.baseurl}${llmCache.url}`;
      }else {
        _URL = `${apiKeys[0].baseurl}${apiKeys[0].url}`;
      }
      // 使用fetch API调用ai接口的流式数据，因为axios在浏览器环境不支持流式处理，所以这里使用fetch API
      const response = await fetch(_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmCache?.keys || apiKeys[0].keys}`,
        },
        body: JSON.stringify(toSendData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);  
      };

      // 获取响应体的读取器
      const reader = response.body.getReader();
      // 创建一个文本解码器，用于将二进制数据转为字符串
      const decoder = new TextDecoder();
      let buffer = '';
      
      // 数据块处理
      function processChunk(chunk) {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop(); // 保留最后一行，可能不完整
        for(const line of lines) {
          if (!line.trim()) continue;
          if (line.trim() == 'event:message') continue;
          try {
            let data = line.replace(/^data:/, '').replace(/^data:/, '').trim();
            // 解析结束标记
            if (data === '[DONE]') {
              // 无论成功或失败，都把status设置为done
              msgList.value[msgObjIndex].status = 'done';
              // 把ai返回的消息保存到栈中
              _requestData.messages.push({
                role: 'assistant', // 助手发送的消息
                content: streamContent,
              });
              return true; // 结束标志
            };

            // 提取流式数据
            const parseData = JSON.parse(data);
            // 获取 content
            const content = parseData.choices?.[0]?.delta?.content;
            const reasoningContent = parseData.choices?.[0]?.delta?.reasoning_content;

            // 如果有内容，就添加到累积变量中
            if (content) {
              streamContent += content;
            };
            if(reasoningContent) {
              reasoning_content += reasoningContent;
            }
            // 覆盖数据
            msgList.value[msgObjIndex] = {
              id: _uuId,
              status: 'stream',
              content: streamContent,
              reasoning_content,
              type: 'reply',
            };  

          }catch(e) {
            console.log('错误的行', line)
            console.warn('解析消息片段失败:', e);
          }
        }
        return false;
      };

      // 持续读取流
      while(true) {
        const { done, value } = await reader.read();
        if(done) break;
        // 将接收到的二进制数据解码为字符串
        const chunk = decoder.decode(value, { stream: true });
        // 处理数据块
        if(processChunk(chunk)) break;
      }

    }catch(err) {
      console.error(err);
    }finally {
      // 无论成功或失败，都把status设置为done
      msgList.value[msgObjIndex].status = 'done';
    }
  }

  /**
   * 添加预发送消息
   */
  addPresendMsg(key: string, role: string, content: string):void {
    _presendMsgObj[key] = {
      role,
      content,
    }
  }

  /**
   * 清除单条预发送消息
   */
  clearPresendMsg(key: string):void {
    if(_presendMsgObj[key]) {
      delete _presendMsgObj[key]
    }
  }

  /**
   * 清除所有预发送消息
   */
  clearAllPresendMsg():void {
    for(const key in _presendMsgObj) {
      delete _presendMsgObj[key];
    }
  }

  /**
   * 清空多轮对话中的历史对话消息
   */
  clearHistoryMsg():void {
    _requestData.messages = []
  }
}