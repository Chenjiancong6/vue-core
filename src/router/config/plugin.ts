const headerMenu = 'vite 插件';
export const PluginRouter =[
  {
    path:'/icon-park',
    component:()=>import('@/views/plugin/icon-park/index.vue'),
    children: [],
    meta:{
      name:'自引入icon park图标',
      headerMenu
    }
  }
];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectPluginRouter = {
  path: ['/icon-park'],
  redirect:'/icon-park',
}