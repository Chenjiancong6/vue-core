import { type Ref, watch, unref } from "vue";

// 函数重载，定义函数的传参类型

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  callback: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
)

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: Ref<HTMLElement>,
  type: K,
  callback: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
)

/**
 * 封装事件监听的hooks函数
 * 使用示例:
 * useEventListener('mousemove',()=> {
 *   console.log('mousemove')
 * });
 *
 * useEventListener(refDom,'mousemove',()=> {
 *   console.log('mousemove')
 * });
 *
 * let off = useEventListener(comRef, "mousemove", () => {
 * console.log("mousemove");
 * });
 * setTimeout(() => {
 * off()
 * }, 3000)
 */
export function useEventListener(...args) {
  // 拿到传参的第一个参数，如果是字符串，说明传入的不是监听事件的节点，则这时默认是对window进行监听
  const target = typeof args[0] === "string" ? window : args.shift();

  // onCleanup执行时机，在监听元素变化时执行，且是最先执行，或者是watch销毁时执行
  // watch 返回一个停止函数， 当调用时，watch就会停止监听
  return watch(
    () => unref(target),
    (element, _, onCleanup) => {
      if (!element) return;
      // element 可能是 window对象 或者 需要被监听的dom
      element.addEventListener(...args);
      onCleanup(() => {
        element.removeEventListener(...args);
      });
    },
    {
      immediate: true,
    }
  );
};
