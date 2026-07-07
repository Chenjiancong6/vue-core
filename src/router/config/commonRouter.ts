// 子路由的路径前不要加 /，因为它是相对于父路由的路径
const headerMenu = "组件";
export const commonRouter = [
  {
    path: "/common",
    meta: {
      name: "canvas",
    },
    children: [
      {
        path: "watermark",
        component: () => import("@/views/comp/watermark/index.vue"),
        meta: {
          name: "水印",
          headerMenu,
        },
      },
      {
        path: "text-waterfall-flow",
        component: () => import("@/views/comp/text-waterfall-flow/index.vue"),
        meta: {
          name: "文字瀑布流",
          headerMenu,
        },
      },
    ],
  },
  {
    path: "/drag",
    meta: {
      name: "拖拽功能",
    },
    children: [
      {
        path: "drag-zoom",
        component: () => import("@/views/comp/drag-zoom/index.vue"),
        meta: {
          name: "拖拽缩放",
          headerMenu,
        },
      },
      {
        path: "com-draggable",
        component: () => import("@/views/comp/com-draggable/index.vue"),
        meta: {
          name: "可拖拽组件",
          headerMenu,
        },
      },
    ],
  },
  {
    path: '/plate-number',
    component: () => import("@/views/comp/plate-number/index.vue"),
    meta: {
      name: "移动端-车牌号码",
      headerMenu,
    },
  },
  {
    path: "/dynamic-form",
    component: () => import("@/views/comp/dynamic-form/index.vue"),
    meta: {
      name: "vue 动态表单",
      headerMenu,
    },
  },
  {
    path: "/btn-loading",
    component: () => import("@/views/comp/btn-loading/index.vue"),
    meta: {
      name: "按钮loading封装",
      headerMenu,
    },
  },
  {
    path: "/data-container",
    component: () => import("@/views/comp/data-container/index.vue"),
    meta: {
      name: "数据/图片加载状态容器",
      headerMenu,
    },
  },
  {
    path: "/ellipsis-text",
    component: () => import("@/views/comp/ellipsis-text/index.vue"),
    meta: {
      name: "文本省略自动tooltip",
      headerMenu,
    },
  },
  {
    path: "/list-lazyLoading",
    component: () => import("@/views/comp/list-lazyLoading/index.vue"),
    meta: {
      name: "列表滚动懒加载",
      headerMenu,
    },
  },
  {
    path: '/vue-defer',
    component: () => import("@/views/comp/vue-defer/index.vue"),
    meta: {
      name: "vue3懒渲染组件",
      headerMenu,
    },
  },
  {
    path: "/table",
    meta: {
      name: "表格",
      headerMenu,
    },
    children: [
      {
        path: "scroll-table",
        component: () => import("@/views/comp/scroll-table/index.vue"),
        meta: {
          name: "el-table 滚动表格",
          headerMenu,
        },
      },
      {
        path: "list-slidein-animation",
        component: () =>
          import("@/views/comp/list-slidein-animation/index.vue"),
        meta: {
          name: "指令：列表元素平滑上升动画",
          headerMenu,
        },
      },
    ],
  },
  {
    path: "/icon",
    meta: {
      name: "svg图标",
      headerMenu,
    },
    children: [
      {
        path: "iconify-icon",
        component: () => import("@/views/comp/iconify-icon/index.vue"),
        meta: {
          name: "本地/在线 svg图标",
          headerMenu,
        },
      },
    ],
  }, {
    path: '/network',
    meta: {
      name: "网络请求",
      headerMenu,
    },
    children: [
      {
        path: "request-axios",
        component: () => import("@/views/comp/request-axios/index.vue"),
        meta: {
          name: "网络请求axios",
          headerMenu,
        },
      }, {
        path: 'test-axios',
        component: () => import('@/views/comp/test-axios/index.vue'),
        children: [],
        meta: {
          name: '测试axios功能',
          headerMenu
        }
      }, {
        path: 'vue3-loading',
        component: () => import('@/views/comp/vue3-loading/index.vue'),
        children: [],
        meta: {
          name: '加载PC端loading组件',
          headerMenu
        }
      }, {
        path: 'vue3-loading-mobile',
        component: () => import('@/views/comp/vue3-loading-mobile/index.vue'),
        children: [],
        meta: {
          name: '加载移动端loading组件',
          headerMenu
        }
      },
    ],
  }


];

// 默认的打开的第一个菜单
// path: 菜单路由的父路径
// redirect: 最终要跳转的路由路径
export const defaultRedirectCommonRouter = {
  path: ["/common"],
  redirect: "/common/watermark",
};
