import { ref } from 'vue';

// 抽屉开关
const drawer = ref(false);

export const useSetting = () => {

  return {
    drawer,
  }
}