import { ElLoading } from 'element-plus';
import type { LoadingConfig } from './loading';

class ElPcLoading implements LoadingConfig {
  // 保存添加的loading实例等属性
  private globalContextLoadingArr = <any>[];
  // 计数全局添加loading 的次数，每add 一次，计数器加1, remove 一次，计数器减1
  private globalLoadingCount = 0;
  // 全局loading 实例
  private globalLoadingInstance: any = null;
  // 全局的context
  private globalContext: any = null;
  // 关闭全局loading 实例的定时器
  private closeGlobalInstanceTimeout: any = -1;

  // 全局设置loading 样式
  private globalLoadingStyle: any = {};
  
  setGlobalContext(context: HTMLElement) {
    this.globalContext = context;
  };

  /**
   * TODO: 先简单实现全局loading 样式设置，后面有需要再改造支持设置单个dom 上的loading 样式
   * 设置全局loading 样式
   * @param style 全局loading 样式
   */
  setGlobalLoadingStyle(style: any) {
    this.globalLoadingStyle = style;
  };
  
  add(context?: HTMLElement) {
    // 如果不传上下文节点的情况，就是加载全局loading
    if (!context) {
      // 如果全局loading 实例不存在，就创建一个,已经存在了就不创建
      if(this.globalLoadingCount <= 0) {
        if(this.globalLoadingInstance) {
          clearTimeout(this.closeGlobalInstanceTimeout);
        }else {
          // 判断是否有传全局的dom 节点
          if(this.globalContext) {
            this.globalLoadingInstance = ElLoading.service({
              lock: true,
              fullscreen: false,
              target: this.globalContext,
              ...this.globalLoadingStyle,
            });
          }else {
            this.globalLoadingInstance = ElLoading.service({
              lock: true,
              fullscreen: false,
              ...this.globalLoadingStyle,
            });
          }
        }
      };
      // 计数器加1
      this.globalLoadingCount++;
      return;
    };

    // 下面是传了指定dom上加载loading的情况

    // 查找当前dom 上的loading 实例
    const currentLoadingInstance = this.globalContextLoadingArr.find(item => item.target === context);
    // 如果当前dom 上有loading 实例，就加1
    // 如果没有，就创建一个
    if(currentLoadingInstance) {
      currentLoadingInstance.loadingInstanceCount++;
      return;
    }

    // 创建新的loading 实例
    const newLoadingInstance = ElLoading.service({
      lock: true,
      fullscreen: false,
      target: context,
      ...this.globalLoadingStyle,
    });
    // 保存新的loading 实例
    this.globalContextLoadingArr.push({
      target: context,
      loadingInstance: newLoadingInstance,
      loadingInstanceCount: 1, // 同一个dom 上每次add 都加1
    });
  }

  remove(context?: HTMLElement) {
    if (!context) {
      this.globalLoadingCount--;
      if(this.globalLoadingCount <= 0) {
        this.delayCloseGlobalInstance();
      }
      return;
    };

    // 指定移除指定dom 上的loading 实例
    const currentLoadingInstance = this.globalContextLoadingArr.find(item => item.target === context);
    if(currentLoadingInstance) {
      currentLoadingInstance.loadingInstanceCount--;
      if(currentLoadingInstance.loadingInstanceCount <= 0) {
        currentLoadingInstance.loadingInstance?.close();
        this.globalContextLoadingArr = this.globalContextLoadingArr.filter(item => item.target !== context);
      }
    }
  }

  clear() {
    // 关闭全局loading 实例
    if(this.globalLoadingInstance) {
      this.globalLoadingInstance.close();
      this.globalLoadingInstance = null;
    }
    this.globalLoadingCount = 0;
  }


  /**
   * 全局loading延迟关闭，避免频繁的全局开启和关闭loading，出现闪屏的情况
   */
  private delayCloseGlobalInstance() {
    clearTimeout(this.closeGlobalInstanceTimeout);
    this.closeGlobalInstanceTimeout = setTimeout(() => {
      this.globalLoadingInstance && this.globalLoadingInstance.close();
      this.globalLoadingInstance = null;
    }, 300);
  }
}


const loading = new ElPcLoading();

export default loading;