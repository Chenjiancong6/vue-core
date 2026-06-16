import { onMounted, ref } from 'vue';


const localStorageKey = 'isllmStream';

export const useLLMLocalStorage = () => {
  // 是否开启流式处理
  const isllmStream = ref<boolean>(false);
  // 设置是否开启流式处理
  const setIsllmStream = (flag: boolean) => {
    isllmStream.value = flag;
    localStorage.setItem(localStorageKey, JSON.stringify(flag));
  }

  // 获取是否开启流式处理
  const getIsllmStream = () => {
    const storedFlag = localStorage.getItem(localStorageKey);
    if (storedFlag !== null || storedFlag !== undefined) {
      return JSON.parse(storedFlag);
    }else{
      return JSON.parse(JSON.stringify(isllmStream.value))
    }
  }

  onMounted(() => {
    isllmStream.value = getIsllmStream();
  });

  return {
    isllmStream,
    setIsllmStream,
    getIsllmStream,
  }
}