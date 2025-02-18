import { createRouter, createWebHashHistory } from 'vue-router';

const routeConfig = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: () => import('@/views/home/index.vue')

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