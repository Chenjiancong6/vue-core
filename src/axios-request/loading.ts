// 添加loading 动画 的逻辑

import axios from "axios";
import request from './index';

let loadingInstance: any = null;

/**
 * 移除loading 动画
 * @param config 请求体配置项
 */
const removeLoading = (config) => {
  if(!loadingInstance) return;

  if(config) {
    loadingInstance?.remove(config.context);
  }else {
    loadingInstance?.remove();
  }
};

// 请求拦截器,添加loading 动画
axios.interceptors.request.use((config:any) => {
  let globalConfig = request.getConfig();

  /**
   * // 规则： 
   * 1. 当全局loading 为true,当前请求loading为 true 时, 添加loading 动画
   * 2. 当全局loading 为true,当前请求loading为 false 时, 不添加loading 动画
   * 3. 当全局loading 为false,当前请求loading为 true 时, 添加loading 动画
   */
  if(config?.loading === false) {
    removeLoading(config);
    return config;
  };
  if(config?.loading === true || globalConfig.loading  === true) {
    loadingInstance?.add(config.context);
    return config;
  };

  return config;

},function(error) {
  let config = null;
  if (error.message && error.message.config) {
    config = error.message.config;
  };
  removeLoading(config);
  return Promise.reject(error);
});

// 响应拦截器,移除loading 动画
axios.interceptors.response.use((response:any) => {
  removeLoading(response.config);
  return response;
},function(error) {
  const { response } = error;
  if (!response) {
    const config = error.message?.config || error.config;
    removeLoading(config);
  } else {
    const { config } = response;
    removeLoading(config);
  }
  return Promise.reject(error);
});


// 导出添加loading 动画的实例方法
export const configLoading = (lading) => {
  loadingInstance = lading;
};