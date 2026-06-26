import axios, { AxiosRequestConfig } from "axios";
import qs from 'qs';

const CONFIG = Symbol()
class Request {

  // 全局配置参数
  [CONFIG]: any = {}

  // 请求头,默认读取axios.defaults.headers
  headers: any = {
    ...axios.defaults.headers,
  }


  /**
   * 全局配置请求参数函数
   */
  config(options: any) {
    this[CONFIG] = {
      ...this[CONFIG],
      ...options,
    };
    
    // 请求的前缀
    if(options?.requestPre) {
      // 给全局axios的baseURL赋值
      axios.defaults.baseURL = options.requestPre;
    }
    console.log('全局配置请求参数函数', options);

    if(options.headers) {
      // 合并请求头
      this.headers = {
        ...axios.defaults.headers,
        ...this.headers,
        ...options.headers,
      }
    };

    // 处理其他配置项
    if(options.responseType) {
      axios.defaults.responseType = options.responseType;
    }
  };

  query(options: any) {
    if(!options?.url) {
      throw new Error('url is required');
    }

    // 合并全局配置和当前请求配置
    const requestConfig: AxiosRequestConfig = {
      ...this[CONFIG],
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    // 请求参数
    let requestData = options?.data || {};
    console.log('this.headers', this.headers);
    console.log('requestConfig', requestConfig);


    // 返回的请求实例
    let requestPromise = null;

    if(options?.type === 'get') {
      requestData = qs.stringify(requestData, { indices: false });
      requestPromise = axios.get(options.url, {
        params: requestData,
        ...requestConfig,
      })
    }
    
    // 支持其他请求方法
    return requestPromise;
  }

  get(options: any) {
    options.type = 'get';
    return this.query(options);
  }
}

let request = new Request();

export default request;
