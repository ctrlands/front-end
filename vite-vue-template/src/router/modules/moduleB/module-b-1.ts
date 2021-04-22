import { RouteRecordRaw } from 'vue-router';

const moduleB1: Array<RouteRecordRaw> = [
  {
    path: '/login3',
    name: 'login3',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import('@/components/HelloWorld.vue')
  }
];

export default moduleB1;
