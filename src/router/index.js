import { createRouter, createWebHashHistory } from 'vue-router';;
import { useMenu } from '@/layout/components/useMenu.ts';
import { commonRouter } from '@/router/config/commonRouter';
import { echartsRouter } from '@/router/config/echartsRouter';
import { mapRouter } from '@/router/config/mapRouter';

const { redirectRouter } = useMenu();

const routeConfig = [
  {
    path: '/',
    redirect: redirectRouter.value['redirect'],
    component: () => import('@/layout/index.vue'),
    children: [...commonRouter, ...echartsRouter, ...mapRouter]
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