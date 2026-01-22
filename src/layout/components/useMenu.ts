import { commonRouter, defaultRedirectCommonRouter } from '@/router/config/commonRouter';
import { echartsRouter, defaultRedirectEchartsRouterr } from '@/router/config/echartsRouter';
import { mapRouter, defaultRedirectMapRouterr } from '@/router/config/mapRouter';
import { AIRouter, defaultRedirectAIRouter } from '@/router/config/AIRouter';
import { PluginRouter, defaultRedirectPluginRouter } from '@/router/config/plugin.ts';
import { routeConfig } from '@/router/index';

import { ref, computed } from 'vue';

const headerMenuMap = {
  '组件': commonRouter,
  '图表': echartsRouter,
  '地图': mapRouter,
  'AI': AIRouter,
  '插件': PluginRouter
};

const defaultRedirectRouter = {
  '组件': defaultRedirectCommonRouter,
  '图表': defaultRedirectEchartsRouterr,
  '地图': defaultRedirectMapRouterr,
  'AI': defaultRedirectAIRouter,
  '插件': defaultRedirectPluginRouter
};
// 路由菜单
const routerMap = [
  ...commonRouter,
  ...echartsRouter,
  ...mapRouter,
  ...AIRouter,
  ...PluginRouter,
];

/**
 * 获取url链接的最后一个/后面的内容
 */
const getUrlLastPath = (url: string) => {
  const urlArr = url.split('/');
  return urlArr[urlArr.length - 1];
}
/**
 * 递归遍历routerMap，找到和getUrlLastPath(window.location.href) 相等的path，返回该path的meta.headerMenu
 */
const getHeaderMenuName = (routeConfigArr) => {
  const lastPath = getUrlLastPath(window.location.href);
  for (const item of routeConfigArr) {
    // 存在children的情况
    if (item?.children && item.children.length > 0) {
      // 将递归调用的结果存储在 result 变量中，并检查如果结果不为空，则返回该结果
      const result = getHeaderMenuName(item.children);
      if (result) return result;
    }else {
      if (item.path?.includes(lastPath)) {
        return item.meta?.headerMenu || '';
      }
    }
  }
};

// const activeMenu = ref(Object.keys(headerMenuMap)[0]);
const activeMenu = ref(getHeaderMenuName(routerMap));

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