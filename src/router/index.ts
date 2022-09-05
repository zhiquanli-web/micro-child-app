import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { mainStaticRoutes } from './modules';
import localCache from '@/utils/catch';
import { tokenKey } from '@/common';
import { firstMenuPath } from '@/utils/mapMenus';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: () =>
      import(/* webpackChunkName: "main" */ '@/views/main/index.vue'),
    children: [...mainStaticRoutes]
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue')
  }
];
console.log('window.__MICRO_APP_BASE_ROUTE__', window.__MICRO_APP_BASE_ROUTE__);

const router = createRouter({
  history: createWebHistory(
    window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL
  ),
  routes
});

router.beforeEach((to) => {
  const token = localCache.getCache(tokenKey);
  const isToLogin = to.path === '/login';
  if (token) {
    isToLogin && router.push('/');
  } else {
    !isToLogin && router.push('/login');
  }
  if (to.path === '/main') {
    return firstMenuPath;
  }
});

export default router;
