import { RouteRecordRaw } from 'vue-router';

const moduleB2: Array<RouteRecordRaw> = [
  {
    path: '/login4',
    name: 'login4',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import('@/components/HelloWorld.vue')
  }
];

export default moduleB2;
