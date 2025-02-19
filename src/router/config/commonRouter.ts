// 子路由的路径前不要加 /，因为它是相对于父路由的路径
export const commonRouter = [
  {
    path: '/common',
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