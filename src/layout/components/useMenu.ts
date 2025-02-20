import { commonRouter, defaultRedirectCommonRouter } from '@/router/config/commonRouter';
import { echartsRouter, defaultRedirectEchartsRouterr } from '@/router/config/echartsRouter';
import { mapRouter, defaultRedirectMapRouterr } from '@/router/config/mapRouter';
import { ref, computed } from 'vue';

const headerMenuMap = {
  '组件': commonRouter,
  '图表': echartsRouter,
  '地图': mapRouter
};

const defaultRedirectRouter = {
  '组件': defaultRedirectCommonRouter,
  '图表': defaultRedirectEchartsRouterr,
  '地图': defaultRedirectMapRouterr
}
const activeMenu = ref(Object.keys(headerMenuMap)[0]);

export const useMenu = () => {

  const setActiveMenu = (menu: string) => {
    activeMenu.value = menu;
  };
  
  // 路由菜单
  const asideMenuList = computed(()=> {
    return headerMenuMap[activeMenu.value];
  });

  // 默认要展开和跳转的菜单路由
  const redirectRouter = computed(()=> {
    return defaultRedirectRouter[activeMenu.value];
  });

  return {
    headerMenuMap,
    activeMenu,
    setActiveMenu,
    asideMenuList,
    redirectRouter
  }
}