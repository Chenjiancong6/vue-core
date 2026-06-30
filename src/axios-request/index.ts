import axios, { AxiosRequestConfig } from "axios";
import qs from 'qs';
import { IRequest, ContentType, RequestOption, ConfigOption } from './request.d';

const CONFIG = Symbol();
class Request {

  // 全局配置参数
  [CONFIG]: any = {}

  // 请求列表，保存每次请求，方便取消某次接口请求或者取消全部请求
  _requestCancelList: any[] = [];

  // 全局请求数据。该对象会被拼到所有的接口的请求参数中
  globalData: any = {};

  // 请求头,默认读取axios.defaults.headers
  headers: any = {
    ...axios.defaults.headers,
  }

  // 可选值有：form、json。对应的请求数据格式分别为：application/x-www-form-urlencoded、application/json。
  contentType: ContentType = 'json';

  // 添加请求拦截器和响应拦截器
  addRequestInterceptor(callback: any, errorCallback: any) {
    return axios.interceptors.request.use(callback, errorCallback);
  };
  addResponseInterceptor(callback: any, errorCallback: any) {
    return axios.interceptors.response.use(callback, errorCallback);
  };

  /**
   * 全局配置请求参数函数
   */
  config(options: ConfigOption) {
    this[CONFIG] = {
      ...this[CONFIG],
      ...options,
    };
    
    // 请求的前缀
    if(options?.requestPre) {
      // 给全局axios的baseURL赋值
      axios.defaults.baseURL = options.requestPre;
    }
    // 超时时间
    if(options?.timeout) {
      axios.defaults.timeout = options.timeout;
    };
    console.log('全局配置请求参数函数', options);

    if(options.headers) {
      // 合并请求头
      this.headers = {
        ...axios.defaults.headers,
        ...this.headers,
        ...options.headers,
      }
    };

    // `responseType` 表示浏览器将要响应的数据类型 'arraybuffer', 'document', 'json', 'text', 'stream', 'blob'
    if(options.responseType) {
      axios.defaults.responseType = options.responseType;
    }
    // 全局请求数据格式
    if(options.contentType) {
      this.contentType = options.contentType as ContentType;
    }

    // 全局请求数据
    if(options.globalData) {
      this.globalData = {
        ...this.globalData,
        ...options.globalData,
      }
    };
  };

  // 获取全局配置参数
  getConfig() {
    return this[CONFIG];
  };

  /**
   * @returns Promise<any>
   * @description 发送请求
   * @param options 请求参数
   * @returns 响应实例 get、post、delete、put、upload
   * @throws Error
   */
  query(options: RequestOption) {
    if(!options?.url) {
      throw new Error('url is required');
    }

    // 合并全局配置和当前请求配置
    const requestConfig: AxiosRequestConfig = {
      ...this[CONFIG], // 全局配置的相关参数都在这里，包括globalConfig、globalData
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    // 设置contentType 
    let contentType = options.contentType || this.contentType;
    console.log('设置contentType', contentType);
    if(contentType === 'form') {
      requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      requestConfig.headers['Content-Type'] = 'application/json';
    };

    // 允许用户自定义header Content-Type
    if(options?.headers?.['Content-Type']) {
      requestConfig.headers['Content-Type'] = options.headers['Content-Type'];
    };

    // 当前请求是否带上前缀
    // 某些请求不需要前缀，覆盖掉axios.default.headers的baseURL字段
    if(options?.needPre == false) {
      requestConfig['baseURL'] = '';
      axios.defaults.baseURL = '';
    }

    // 创建取消请求实例new axios.CancelToken。把请求添加到请求列表中
    if(options?.cancel !=false) {
     options.cancelToken = new axios.CancelToken((cancel) => {
      if(options.cancelId) {
        this._requestCancelList.push({
          cancelId: options.cancelId,
          cancel,
          config: options,
        });
        return ;
      };
      this._requestCancelList.push({
        cancel,
        config: options,
      });
     })
    }

    // 请求参数
    let requestData = options?.data || {};
    console.log('requestConfig', requestConfig);


    let _globalData = this.globalData || {};
    // 当前接口请求是否禁用全局请求参数。默认false
    if(options?.globalDataDisabled) {
      _globalData = {};
    }

    // 如果有全局请求参数，把参数拼接到接口请求参数中
    // 本次请求，需要设置全局请求参数
    if(options?.isUpload) {
      for(const key in _globalData) {
        // 上传模式下，数据一般是new FormData得到的，带有append的方法
        options.data.append(key, _globalData[key]);
      }
    }else {
      // 非上传模式下，把全局请求参数添加到接口请求参数对象中
      for(const key in _globalData) {
        requestData[key] = _globalData[key];
      }
    };

    /**
     * 单个请求方法请求和响应拦截器
     */
    if(options?.requestInterceptor) {
      axios.interceptors.request.use(options?.requestInterceptor?.callback, options?.requestInterceptor?.errorCallback);
    }
    if(options?.responseInterceptor) {
      axios.interceptors.response.use(options?.responseInterceptor?.callback, options?.responseInterceptor?.errorCallback);
    };

    // 返回的请求实例
    let requestPromise = null;

    // get请求不能格式化数据
    if (options.type != "get") {
      // get 请求使用 params 接收传参。如果传入的是data ,转化为params格式
      if(options?.data) {
        requestData = {
          ...requestData,
          ...options.data,
        };
      };

      if (contentType === "form") {
        // qs.stringify({ a: ['b', 'c', 'd'] }, { indices: false });  =>  'a=b&a=c&a=d'
        // qs.stringify({ id: ['b', 'c'] }, { arrayFormat: 'indices' })  => 'id[0]=b&id[1]=c'
        // qs.stringify({ id: ['b', 'c'] }, { arrayFormat: 'brackets' })  => 'id[]=b&id[]=c'
        // qs.stringify({ id: ['b', 'c'] }, { arrayFormat: 'repeat' })  =>  'id=b&id=c'
        // 后面如需定制，可以通过额外参数来匹配逻辑
        requestData = qs.stringify(requestData, { indices: false });
      } else {
        requestData = JSON.stringify(requestData);
      }
    }

    /**
     * 下面设置请求的方法post | get | delete | put | patch
     */
    if(options?.type === 'get') {
      requestConfig.paramsSerializer = (params) => {
        return qs.stringify(params, { indices: false });
      };
      requestPromise = axios.get(options.url, {
        params: requestData,
        ...requestConfig,
      })
    };
    if(options?.type === 'post') {
      // 如果是长传请求，需要设置请求体的contentType
      if(options.isUpload) {
        requestConfig.headers['Content-Type'] = 'multipart/form-data';
        requestData = options.data;
      };
      requestPromise = axios.post(options.url, requestData, requestConfig)
    };
    if(options?.type === 'delete') {
      requestPromise = axios.delete(options.url,{
        data: requestData,
        ...requestConfig,
      })
    };
    if(options?.type === 'put') {
      requestPromise = axios.put(options.url, requestData, requestConfig)
    };
    if(options?.type === 'patch') {
      requestPromise = axios.patch(options.url, requestConfig)
    };
    
    // 返回请求实例
    return requestPromise;
  };

  /**
   * 取消请求, 如果传入cancelId, 则取消指定的请求, 否则取消全部请求
   * 默认是空字符串，取消全部请求
   * @param cancelId 取消请求的id
   */
  // cancel提供一个默认值
  cancel(cancelId: symbol | string = '') {
    if (cancelId) {
      for (let reqCancel of this._requestCancelList) {
        if (reqCancel.cancelId == cancelId) {
          reqCancel.cancel({
            config: reqCancel.config,
          });
        }
      }
      return;
    }
    // 切换路由时，取消全部的请求
    this._requestCancelList.forEach((item) => {
      item.cancel({config: item.config});
    });
    this._requestCancelList = [];
  }

  /**
   * 下面创建请求方法 post | get | delete | put | patch
   */
  get(options: RequestOption) {
    options.type = 'get';
    return this.query(options);
  };
  post(options: RequestOption) {
    options.type = 'post';
    return this.query(options);
  };
  delete(options: RequestOption) {
    options.type = 'delete';
    return this.query(options);
  };
  put(options: RequestOption) {
    options.type = 'put';
    return this.query(options);
  };
  patch(options: RequestOption) {
    options.type = 'patch';
    return this.query(options);
  };
  // 使用multipart方式上传文件
  upload(options: RequestOption) {
    options.type = "post";
    options.isUpload = true;
    return this.query(options);
  };
}

// 创建请求实例
const request:IRequest = new Request();

export default request;
