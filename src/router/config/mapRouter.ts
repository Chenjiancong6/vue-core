
const headerMenu = '地图';

export const mapRouter = [{
  path:'/gaodeMap',
  component: () => import('@/views/map/gaode-map/index.vue'),
  meta:{
    name:'高德地图',
    headerMenu
  }
},{
  path:'/mapboxglMap',
  component: () => import('@/views/map/mapboxgl-map/index.vue'),
  meta:{
    name:'mapboxgl地图',
    headerMenu
  }
},{
  path:'/mapTool',
  component: () => import('@/views/map/map-tool/index.vue'),
  meta:{
    name:'地图坐标拾取器工具',
    headerMenu
  }
}];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectMapRouterr = {
  path: ['/gaodeMap'],
  redirect:'/gaodeMap',
}
