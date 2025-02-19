import { commonRouter } from '@/router/config/commonRouter';
import { echartsRouter } from '@/router/config/echartsRouter';
import { mapRouter } from '@/router/config/mapRouter';
import { ref, computed } from 'vue';

export const useMenu = () => {
  const headerMenuMap = {
    '组件': commonRouter,
    '图表': echartsRouter,
    '地图': mapRouter
  };
  const activeMenu = ref(Object.keys(headerMenuMap)[0]);

  const setActiveMenu = (menu: string) => {
    activeMenu.value = menu;
  };

  const asideMenuList = computed(()=> {
    return headerMenuMap[activeMenu.value];
  });

  return {
    headerMenuMap,
    activeMenu,
    setActiveMenu,
    asideMenuList
  }
}