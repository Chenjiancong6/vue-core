import { AIMsgHandler } from './ai-llm/llm-no-stream/ai-msg-handler';
import { LLMNoStream } from './ai-llm/llm-no-stream/llm-no-stream';
import { LLMStream } from './ai-llm/llm-stream/llm-stream';

const LLMApiObj = {
  apiUrl: '/v3/chat/completions',
  model: 'deepseek-v3-250324', // 深seek v3 模型
  // model: 'doubao-seed-1-6-251015', // 豆包 seed 1.6 模型
  // model: 'glm-4-7-251222', // glm-4-7-251222 模型
  // model: 'doubao-seed-2-0-pro-260215', // Doubao-Seed-2.0-pro 模型
};

export const noStreamLLM = new LLMNoStream(LLMApiObj);

// 流式处理
export const streamLLM = new LLMStream(LLMApiObj);


export const aiMsgHandler = new AIMsgHandler({
  noStreamLLM,
});

/**
 * 添加预发送消息
 */
noStreamLLM.addPresendMsg('who-are-you', 'system', '你的名字叫超级大哈克');

