const headerMenu = 'AI';
export const AIRouter =[
  {
    path:'/iat',
    component:()=>import('@/views/AI/iat/index.vue'),
    children: [],
    meta:{
      name:'讯飞语音听写识别',
      headerMenu
    }
  }, 
  {
    path:'/chat',
    component:()=>import('@/views/AI/chat/index.vue'),
    children: [],
    meta:{
      name:'AI助手',
      headerMenu
    }
  }
];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectAIRouter = {
  path: ['/iat'],
  redirect:'/iat',
}