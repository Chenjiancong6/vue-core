/**
 * new 实例化一个axios网络请求，用于请求deepseek v3 模型 API 接口
 * 通过暴露一个Crequest类，不同的接口请求可以进行多个实例化
 */
import Crequest from './request';
const TIME_OUT = 20000;
import localCache from '@/utils/cache';
import { getSelectedModel } from '@/ai-lib/ai-api-keys/persistence';
import { getApiKeys } from '@/ai-lib/ai-api-keys/api-keys';

let apiKeys = getApiKeys();

const Request = new Crequest({
  baseURL: getSelectedModel()?.baseurl || apiKeys[0].baseurl,
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getSelectedModel()?.keys || apiKeys[0].keys}`,
  }
  // interceptors: {
  //   requestInterceptor: (config: any) => {
  //     // token拦截
  //     const token = localCache.getCache('token') ?? '';
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }
  //     // console.log('请求成功的拦截')
  //     return config;
  //   },
  //   requestInterceptorCatch: (err) => {
  //     // console.log('请求失败的拦截')
  //     return err;
  //   },
  //   responseInterceptor: (res) => {
  //     // console.log('响应成功的拦截')
  //     return res;
  //   },
  //   responseInterceptorCatch: (err) => {
  //     // console.log("响应失败的拦截");
  //     return err;
  //   }
  // }
});

export default Request;
