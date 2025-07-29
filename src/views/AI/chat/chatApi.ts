import Request from '@/network/chatRequest';

/**
 * 请求deepseek v3 模型 API 接口
 */
export const chatV3Api = (option?: any) => {
  return Request.post({
    url: '/v3/chat/completions',
    data: {
      "model": "deepseek-v3-250324",
      "messages": [
        {
          "role": "system",
          "content": "你的名字叫超级大哈克"
        },
        {
          "role": "user",
          "content": "你好!你是谁？"
        }
      ]
    }
  });
}

