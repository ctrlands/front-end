import { RouteRecordRaw } from 'vue-router';

const moduleA1: Array<RouteRecordRaw> = [
  {
    path: '/login1',
    name: 'login1',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import('@/views/page1/index.vue')
  },
  {
    path: '/login11',
    name: 'login11',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import('@/views/page1/index.vue')
  }
];

export default moduleA1;
