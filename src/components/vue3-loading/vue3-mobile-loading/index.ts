import type { LoadingConfig } from './loading.d';
import type { ToastOptions } from 'vant';
import { showLoadingToast, closeToast } from 'vant';
import 'vant/es/toast/style';

class VantMobileLoading implements LoadingConfig {
  // 保存是否有toast实例
  private hasToastInstance: boolean = false;
  // 关闭全局loading 实例的定时器
  private closeGlobalInstanceTimeout: any = -1;

  add(toastOptions?: ToastOptions) {
    // 为了兼容处理@cjc/axios的loading配置, 在@cjc/axios的配置中可能会传入context上下文加载dom 元素
    // 但是移动端的加载功能，不需要传入context上下文，直接加载到body上，不支持针对指定元素加载loading
    // 判断下，如果传入的不是对象，就是传入参数有误。对象参数必须在ToastOptions 中规定的属性中
    // toastOptions如果是一个dom 元素，就是传入参数有误
    // 要求传入context属性参数就是toastOptions对象
    if (toastOptions instanceof HTMLElement) {
      throw new Error('toastOptions 不能是一个dom 元素');
    }

    if (toastOptions && typeof toastOptions !== 'object') {
      throw new Error('toastOptions 必须是一个对象');
    }

    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      overlay: true,
      duration: 0,
      ...toastOptions
    });
    // 保存是否有loading实例
    this.hasToastInstance = true;
  };

  remove() {
    if (!this.hasToastInstance) return;
    this.delayCloseGlobalInstance();
  };

    /**
   * 全局loading延迟关闭，避免频繁的全局开启和关闭loading，出现闪屏的情况
   */
  private delayCloseGlobalInstance() {
    clearTimeout(this.closeGlobalInstanceTimeout);
    this.closeGlobalInstanceTimeout = setTimeout(() => {
      this.hasToastInstance = false;
      closeToast();
    }, 300);
  }
}

const loading = new VantMobileLoading();

export default loading;