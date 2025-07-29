import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 定义axios拦截器的类型
export interface CRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

//axios请求的类型
export interface CRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: CRequestInterceptors<T>;
  showLoading?: boolean;
}
