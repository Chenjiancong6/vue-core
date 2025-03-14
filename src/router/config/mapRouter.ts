export const mapRouter = [{
  path:'/gaodeMap',
  component: () => import('@/views/map/gaode-map/index.vue'),
  meta:{
    name:'高德地图'
  }
}];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectMapRouterr = {
  path: ['/gaodeMap'],
  redirect:'/gaodeMap',
}
