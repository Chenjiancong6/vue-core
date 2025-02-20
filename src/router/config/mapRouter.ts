export const mapRouter = [{
  path:'/map',
  component: () => import('@/views/map/index.vue'),
  meta:{
    name:'地图'
  }
}];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectMapRouterr = {
  path: ['/map'],
  redirect:'/map',
}
