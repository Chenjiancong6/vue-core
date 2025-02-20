export const echartsRouter = [{
  path:'/ec',
  component: () => import('@/views/ec/index.vue'),
  meta:{
    name:'图表'
  }
}];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectEchartsRouterr = {
  path: ['/ec'],
  redirect:'/ec',
}