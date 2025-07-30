import mitt from "mitt";
import type { EventType } from "mitt";
import { onBeforeUnmount } from "vue";

export interface UseEmittOption {
  name: EventType; // 事件名称
  callback: Function; // 回调
}

export const emitter = mitt();

/**
 * mitt的vue3 hooks封装
 * import { emitter, useEmitt } from './use-emitt.ts';
 * emitter.emit('xxx');
 * useEmitt('xxx', () => {})
 * @param option 事件名称
 * @param callback 事件回调
 * @returns { emitter }
 */
export const useEmitt = (option?: UseEmittOption | EventType, callback?: any) => {
  // 兼容之前useEmitt({name: 'test', callback: () => {}})的写法
  if (!callback) {
    if (option) {
      emitter.on(option.name, option.callback);

      onBeforeUnmount(() => {
        emitter.off(option.name);
      });
    }
  }
  // 现在修改了写法 useEmitt('test', () => {});
  else {
    emitter.on(option, callback);
    onBeforeUnmount(() => {
      emitter.off(option, callback);
    });
  }

  return {
    emitter,
  };
};