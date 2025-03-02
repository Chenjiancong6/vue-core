import { createRouter, createWebHashHistory } from 'vue-router';;
import { useMenu } from '@/layout/components/useMenu.ts';
import { commonRouter } from '@/router/config/commonRouter';
import { echartsRouter } from '@/router/config/echartsRouter';
import { mapRouter } from '@/router/config/mapRouter';
import { AIRouter } from '@/router/config/AIRouter';

const { redirectRouter } = useMenu();

const routeConfig = [
  {
    path: '/',
    redirect: redirectRouter.value['redirect'],
    component: () => import('@/layout/index.vue'),
    children: [
      ...commonRouter,
      ...echartsRouter,
      ...mapRouter,
      ...AIRouter,
      // 路由顺序：确保 404 路由规则放在路由列表的最后，否则它可能会覆盖其他路由
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: routeConfig,
});

export const setupRouter = (app) => {
  app.use(router);
}