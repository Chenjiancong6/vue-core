// ts declare 关键字 用于声明一个全局的变量、函数、类等 （只给类型，不给实现）
import type { AxiosStatic, AxiosRequestConfig } from 'axios';

/**
 * form 是 application/x-www-form-urlencoded 的缩写
 * 
 * json 是 application/json 的缩写
 */
export declare type ContentType = 'form' | 'json';

// 请求参数
export declare interface IRequestOption {
  url: string;
  type?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  headers?: any;
  contentType?: ContentType;
  needPre?: boolean;
  loading?: boolean;
  cancelToken?: any;
  cancel?: boolean;
  cancelId?: symbol | string;
  isUpload?: boolean;
  // loading的作用域
  context?: HTMLDivElement | undefined;
  // 当前接口请求是否禁用全局请求参数。默认false
  globalDataDisabled?: boolean;
  // 单个请求拦截器
  requestInterceptor?: {
    callback: (config: any)=> any;
    errorCallback?: (error: any)=> any;
  };
  // 单个响应拦截器
  responseInterceptor?: {
    callback: (response: any)=> any;
    errorCallback?: (error: any)=> any;
  };
}

// 请求参数类型
export declare type RequestOption = IRequestOption & AxiosRequestConfig;

// 全局配置请求的参数类型
export declare type ConfigOption = {
  requestPre?: string;
  headers?: any;
  globalData?: any; // 全局请求数据
  globalConfig?: any; // 全局配置参数
  contentType?: ContentType;
  timeout?: number;
  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream' | 'blob';
}

export declare interface IRequest {
  get: (options: RequestOption)=> Promise<any>,
  post: (options: RequestOption)=> Promise<any>,
  delete: (options: RequestOption)=> Promise<any>,
  patch: (options: RequestOption)=> Promise<any>,
  put: (options: RequestOption)=> Promise<any>,
  upload: (options: RequestOption)=> Promise<any>,
  config: (options: ConfigOption)=> void,
  getConfig?: () => ConfigOption,
  query: (options: RequestOption)=> Promise<any>,
  cancel: (cancelId?: symbol | string) => void,
  addRequestInterceptor: (callback?: (config: any)=> any, errorCallback?:(error: any)=> any)=> any,
  addResponseInterceptor: (callback?: (response: any)=> any, errorCallback?: (error: any)=> any)=> any,
}