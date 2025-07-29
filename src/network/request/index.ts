import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { CRequestInterceptors, CRequestConfig } from './type';
import { ElLoading, ElMessage } from 'element-plus';
const DEFAULT_SHOWING = true; // 默认打开加载的loading

/**
 * 封装接口请求的类 函数
 * @param config 配置对象
 * @example
 * const request = new Crequest({
 *  baseURL: 'http://localhost:8080',
 *  timeout: 5000,
 *  header: {
 *   'Content-Type': 'application/json',
 *   'Authorization': 'Bearer ' + token
 *  }
 * });
 */
class Crequest {
  instance: AxiosInstance; // 创建一个接收请求的实例属性
  interceptors?: CRequestInterceptors; // 拦截器的属性，可选
  loading?: any;
  showLoading?: boolean;

  constructor(config: CRequestConfig) {
    // 创建一个axios实例
    this.instance = axios.create(config);

    // 保存从实例化传递过来的信息
    this.interceptors = config.interceptors;
    // 如果没有config.showLoading，则为true
    this.showLoading = config.showLoading ?? DEFAULT_SHOWING;

    // 这里的拦截器是实例化时的拦截器，当实例化中有传，就会触发改拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    //创建全局的拦截器，任何网络请求都会在这拦截处理
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据....',
            background: 'rgba(0, 0, 0, 0.5)'
          });
        }
        // console.log('所有的实例都有的拦截器: 请求成功拦截');
        return config;
      },
      (err) => {
        // console.log('所有的实例都有的拦截器: 请求失败拦截')
        return err;
      }
    );
    // 响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        // console.log(res, res.data, "request 方法");
        // 将loading移除
        this.loading?.close();
        const data = res.data;

        if (data.returnCode === '-1001') {
          console.error('请求失败~, 错误信息');
          ElMessage.error('请求失败~, 错误信息');
        } else {
          // console.log('所有的实例都有的拦截器: 响应成功拦截');
          return data;
        }
      },
      (err) => {
        // 将loading移除
        this.loading?.close();

        //判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.error('404的错误~');
          ElMessage.error('404的错误~');
        }
        // console.log('所有的实例都有的拦截器: 响应失败拦截')
        return err;
      }
    );
  }

  // request 方法
  request<T>(config: CRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 把请求拦截器放到 this.instance.request(config)中处理触发拦截
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      // 如果存入showLoading的参数为false,则不加载loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 响应拦截器
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }

          // 请求后将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEFAULT_SHOWING;
          resolve(res);
        })
        .catch((err) => {
          reject(err);

          // 将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEFAULT_SHOWING;
          return err;
        });
    });
  }

  // 也可以使用get,post等方法直接调用
  get<T>(config: CRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }
  post<T>(config: CRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }
  delete<T>(config: CRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }
  patch<T>(config: CRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH' });
  }
}
export default Crequest;
