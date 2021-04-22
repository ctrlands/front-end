import { RouteRecordRaw } from 'vue-router';

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/init'
  },
  {
    path: '/redirect/:path*', // 刷新路由
    component: () => import(/* webpackChunkName: "login" */ '@/components/HelloWorld.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/page1/index.vue')
  },
  {
    path: '/init',
    name: 'init',
    meta: {
      title: '初始化',
      permission: false
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/home/index.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "error-page-404" */ '@/components/HelloWorld.vue'),
    name: 'Page404',
    meta: {
      title: '404',
      permission: false
    }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "error-page-401" */ '@/components/HelloWorld.vue'),
    name: 'Page401',
    meta: {
      title: '401',
      permission: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
];
export default constantRoutes;
