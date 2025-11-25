// 子路由的路径前不要加 /，因为它是相对于父路由的路径
const headerMenu = '组件';
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
          name: '水印',
          headerMenu
        },
      },
      {
        path:'text-waterfall-flow',
        component: () => import('@/views/comp/text-waterfall-flow/index.vue'),
        meta: {
          name:'文字瀑布流',
          headerMenu
        }
      }
    ]
  },
  {
    path:'/drag',
    meta: {
      name: '拖拽功能',
    },
    children: [
      {
        path:'drag-zoom',
        component: () => import('@/views/comp/drag-zoom/index.vue'),
        meta: {
          name: '拖拽缩放',
          headerMenu
        }
      },
      {
        path:'com-draggable',
        component: () => import('@/views/comp/com-draggable/index.vue'),
        meta: {
          name: '可拖拽组件',
          headerMenu
        }
      },
    ]
  },
  {
    path:'/dynamic-form',
    component: () => import('@/views/comp/dynamic-form/index.vue'),
    meta: {
      name: 'vue 动态表单',
      headerMenu
    }
  },
  {
    path:'/btn-loading',
    component: () => import('@/views/comp/btn-loading/index.vue'),
    meta: {
      name: '按钮loading封装',
      headerMenu
    }
  },
  {
    path:'/data-container',
    component: () => import('@/views/comp/data-container/index.vue'),
    meta: {
      name: '数据加载状态容器',
      headerMenu
    }
  },
  {
    path:'/ellipsis-text',
    component: () => import('@/views/comp/ellipsis-text/index.vue'),
    meta: {
      name: '文本省略自动tooltip',
      headerMenu
    }
  }
]

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectCommonRouter = {
  path: ['/common'],
  redirect:'/common/watermark',
}