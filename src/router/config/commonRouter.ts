// 子路由的路径前不要加 /，因为它是相对于父路由的路径
export const commonRouter = [
  {
    path: '/common',
    meta: {
      name: 'canvas'
    },
    children: [
      {
        path: 'watermark',
        component: () => import('@/views/comp/watermark/index.vue'),
        meta: {
          name: '水印'
        },
      },
      {
        path:'text-waterfall-flow',
        component: () => import('@/views/comp/text-waterfall-flow/index.vue'),
        meta: {
          name:'文字瀑布流'
        }
      }
    ]
  },
]

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectCommonRouter = {
  path: ['/common'],
  redirect:'/common/watermark',
}