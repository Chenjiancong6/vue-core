import { createRouter, createWebHashHistory } from 'vue-router';
import { commonRouter } from './config/commonRouter';

const routeConfig = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [...commonRouter]
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