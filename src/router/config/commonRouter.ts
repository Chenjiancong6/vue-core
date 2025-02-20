// 子路由的路径前不要加 /，因为它是相对于父路由的路径
export const commonRouter = [
  {
    path: '/common',
    redirect:'/common/home',
    meta: {
      name: '公共组件'
    },
    children: [{
      path: 'home',
      component: () => import('@/views/home/index.vue'),
        meta: {
          name: '首页'
        }
      },
      {
        path: 'watermark',
        component: () => import('@/views/watermark/index.vue'),
        meta: {
          name: '水印'
        },
      },
      {
        path:'num',
        meta: {
          name: '数字组件'
        },
        children:[{
          path:"num11",
          meta:{
            name:'数字'
          }
        }]
      }
    ]
  },
  {
    path: '/test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      name: 'test组件'
    }
  }
]

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectCommonRouter = {
  path: ['/common'],
  redirect:'/common/home',
}