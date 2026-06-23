import { v4 as uuidv4 } from 'uuid';
import { hasLLMStream, aiChatMsgList } from '@/views/AI/rag-ai-chat/store';
import { useHistoryChatMsgList } from '@/views/AI/rag-ai-chat/components/hooks/use-history-chat-msg-list';
import { useAiChatMsgList } from '@/views/AI/rag-ai-chat/components/hooks/use-ai-chat-msg-list';

const { addAIMsg } = useAiChatMsgList();
const { addHistoryChatMsg } = useHistoryChatMsgList();


// 非流式处理-获取大语音模型返回结果
function getNoStreamResult(res: any) {
  if (!res) return;
  const result = res?.choices?.[0]?.message?.content || '';
  // 数组对象去重，只保留document_id不同的
  const reference = res?.choices?.[0]?.message?.reference || [];
  // 按 document_id 去重
  const uniqueReference = Array.from(new Map(reference.map(item => [item.document_id, item])).values());
  console.log( '非流式处理-获取大语音模型返回结果:', res,);
  addAIMsg({
    content: result,
    type: 'reply',
    status: 'done',
    reference: uniqueReference || [],
  });
  addHistoryChatMsg({
    role: 'assistant',
    content: result,
  });
};

// 流式处理-获取大语音模型返回结果
async function getStreamResult(response: any, _uuId: string) {
  if (!response) return;

  let streamContent = ''; // 流式数据累积变量
  let reasoning_content = ''; //  reasoning_content 用于存储模型的推理内容(思考过程)

  // 数据正在流式输出，处于thinking 状态
  addAIMsg({
    id: _uuId,
    status: 'thinking',
  });

  // 根据id,找到msgList数组对象中对应的消息
  const msgObjIndex = aiChatMsgList.value.findIndex(item => item.id === _uuId);

  // 获取响应体的读取器
  const reader = response.body.getReader();
  // 创建一个文本解码器，用于将二进制数据转为字符串
  const decoder = new TextDecoder();
  let buffer = '';
  let uniqueReference = []; // 引用的文档
  // 数据块处理
  function processChunk(chunk) {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop(); // 保留最后一行，可能不完整
    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.trim() == 'event:message') continue;
      try {
        let data = line.replace(/^data:/, '').replace(/^data:/, '').trim();
        // 解析结束标记
        if (data === '[DONE]') {
          if (msgObjIndex == -1) return;
          // 无论成功或失败，都把status设置为done
          aiChatMsgList.value[msgObjIndex].status = 'done';
          // 把ai返回的消息保存到历史对话中，用于上下文理解
          addHistoryChatMsg({
            role: 'assistant',
            content: streamContent,
          });
          return true; // 结束标志
        };

        // 提取流式数据
        const parseData = JSON.parse(data);
        // 获取 content
        const content = parseData.choices?.[0]?.delta?.content;
        const reasoningContent = parseData.choices?.[0]?.delta?.reasoning_content;
        // 获取 reference 引用的文档
        const reference = parseData.choices?.[0]?.delta?.reference || [];

        if(reference.length > 0) {
          // 按 document_id 去重
          uniqueReference = Array.from(new Map(reference.map(item => [item.document_id, item])).values());
        }

        // 如果有内容，就添加到累积变量中
        if (content) {
          streamContent += content;
        };
        if (reasoningContent) {
          reasoning_content += reasoningContent;
        }
        // 更新消息列表中的数据
        aiChatMsgList.value[msgObjIndex] = {
          id: _uuId,
          status: 'stream', // 流式状态
          content: streamContent,
          reasoning_content,
          type: 'reply',
          reference: uniqueReference || [], // 引用的文档
        };

      } catch (e) {
        console.log('错误的行', line)
        console.warn('解析消息片段失败:', e);
      }
    }
    return false;
  };

  // 持续读取流
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // 将接收到的二进制数据解码为字符串
    const chunk = decoder.decode(value, { stream: true });
    // 处理数据块
    if (processChunk(chunk)) break;
  };

};

/**
 * 调用ragflow接口，获取ai模型回复
 */
export const ragflow_chat_request = async (body: any, method = 'POST') => {
  // 生成唯一id
  const _uuId = uuidv4();
  try {
    const response = await fetch('/ragflow/chat/completions', {
      method,
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  
    
    // 非流式处理-获取大语音模型返回结果
    if (!hasLLMStream.value) {
      const data = await response.json();
      getNoStreamResult(data);
    } else {
      getStreamResult(response, _uuId);
    }
    return response;
  } catch (error) {
    console.error('ragflow_chat_request error:', error);
    return error;
  } finally {
    // 根据id,找到msgList数组对象中对应的消息
    const msgObjIndex = aiChatMsgList.value?.findIndex(item => item.id === _uuId);
    if (msgObjIndex == -1) return;
    // 无论成功或失败，都把status设置为done
    aiChatMsgList.value[msgObjIndex].status = 'done';
  }
}
