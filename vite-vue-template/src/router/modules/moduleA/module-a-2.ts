import { RouteRecordRaw } from 'vue-router';

const moduleA2: Array<RouteRecordRaw> = [
  {
    path: '/login2',
    name: 'login2',
    meta: {
      title: '登录',
      permission: false
    },
    component: () => import('@/components/HelloWorld.vue')
  }
];

export default moduleA2;
