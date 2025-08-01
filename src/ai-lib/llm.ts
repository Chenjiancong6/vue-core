import { AIMsgHandler } from './ai-llm/ai-msg-handler';
import { LLMNoStream } from './ai-llm/llm-no-stream';

export const noStreamLLM = new LLMNoStream({
  apiUrl: '/v3/chat/completions',
  model: 'deepseek-v3-250324',
});

export const aiMsgHandler = new AIMsgHandler({
  noStreamLLM,
});

/**
 * 添加预发送消息
 */
noStreamLLM.addPresendMsg('system', 'system', '你的名字叫超级大哈克');
