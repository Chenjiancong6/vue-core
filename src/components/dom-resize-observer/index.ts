/**
 * resize-observer-polyfill 是一个用于模拟实现 Resize Observer API 的轻量级 JavaScript 库。这个库允许开发者实时监控元素的大小变化，而无需轮询或者依赖于 DOM 变动事件
 * 这里对 resize-observer-polyfill 进行封装，方便在项目中使用
 * 使用方法：
 * import ResizeObserver from '@/components/dom-resize-observer';
  ResizeObserver.resizeObserver(dom, ({width, height, top, left})=> {
    console.log(width, height, top, left)
  })
 */

import ResizeObserver from 'resize-observer-polyfill';

// 创建一个dom 容器，保存需要挂载监听的dom 元素
const roDomArr = [];

interface IRoDomObj {
  dom: HTMLElement;
  ro: ResizeObserver;
}

export default {
  /**
   * 获取dom 元素在容器中的索引
   * @param {HTMLElement} dom 元素
   * @returns {number} 索引
   */
  getRoDomIndex(dom: HTMLElement) {
    for (let i = 0; i < roDomArr.length; i++) {
      if (roDomArr[i].dom === dom) {
        return i;
      }
    }
    return -1;
  },

  /**
   * 监听dom 元素的大小变化
   * @param {HTMLElement} dom 元素
   * @param {function} callback 回调函数
   */
  resizeObserver(dom: HTMLElement, callback: (entries: object) => void) {
    // 先判断dom 元素是否已经被监听
    const roDomIndex = this.getRoDomIndex(dom);
    let roDomObj: IRoDomObj = {
      dom,
      ro: null,
    };
    // 如果dom 元素没有被监听，就创建一个新的实例
    if (roDomIndex === -1) {
      roDomObj = {
        dom,
        // ro 对象为 resize-observer-polyfill 库的实例
        ro: new ResizeObserver(function (entries, observer) {
          for (const entry of entries) {
            // 获取元素的位置和大小
            const { left, top, width, height } = entry.contentRect;
            // 调用回调函数
            callback({ left, top, width, height });
          }
        }),
      };
      // 监听dom 元素的大小变化
      roDomObj.ro.observe(dom);
      // 把dom 元素添加到容器中
      roDomArr.push(roDomObj);
    }
  },

  /**
   * 取消监听dom 元素的大小变化
   * @param {HTMLElement} dom 元素
   */
 unobserve(dom: HTMLElement) {
  // 先判断dom 元素是否已经被监听
  const roDomIndex = this.getRoDomIndex(dom);
  if (roDomIndex !== -1) {
    const { ro } = roDomArr[roDomIndex];
    // 取消监听dom 元素的大小变化
    ro.unobserve(dom);
    ro.disconnect();
    // 从容器中移除dom 元素
    roDomArr.splice(roDomIndex, 1);
  }
 }
}