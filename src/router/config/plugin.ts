const headerMenu = 'vite插件';
export const PluginRouter =[
  {
    path:'/icon-park',
    component:()=>import('@/views/plugin/icon-park/index.vue'),
    children: [],
    meta:{
      name:'按需引入icon-park图标',
      headerMenu
    }
  },{
    path:'/vant-auto-import',
    component:()=>import('@/views/plugin/vant-auto-import/index.vue'),
    children: [],
    meta:{
      name:'按需自动引入vant组件样式',
      headerMenu
    }
  },{
    path:'/project-console',
    component:()=>import('@/views/plugin/project-console/index.vue'),
    children: [],
    meta:{
      name:'项目信息控制台打印',
      headerMenu
    }
  },{
    path:'/clear-console',
    component:()=>import('@/views/plugin/clear-console/index.vue'),
    children: [],
    meta:{
      name:'清除浏览器控制台打印',
      headerMenu
    }
  },{
    path:'/svg-icons',
    component:()=>import('@/views/plugin/svg-icons/index.vue'),
    children: [],
    meta:{
      name:'svg-icons插件二次封装',
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