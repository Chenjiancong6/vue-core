export interface ApiKeyConfig {
  name: string;
  model: string;
  baseurl: string;
  url: string;
  keys: string;
  disabled?: boolean;
  thinking?: boolean; // 是否是思考模型
}

export function getApiKeys(): ApiKeyConfig[] {
  return [
    {
      name: 'deepseek',
      model: 'deepseek-reasoner',
      thinking: true,
      baseurl: 'https://api.deepseek.com',
      url: '/chat/completions',
      keys: 'sk-f95a3dae24f5471e85d1978a451d0d18'
    },
    {
      name: 'deepseek-v3-250324',
      model: 'deepseek-v3-250324',
      baseurl: 'https://ark.cn-beijing.volces.com/api',
      url: '/v3/chat/completions',
      keys: '76536990-3525-4f56-8d95-2ed176aa0372'
    },
    {
      name: '智谱glm-5',
      model: 'glm-5',
      baseurl: 'https://open.bigmodel.cn/api',
      url: '/paas/v4/chat/completions',
      keys: '7b4356d269e64e1889844aff2d063f4e.JgC4VOY0TPJfyL8a'
    }
  ];
}