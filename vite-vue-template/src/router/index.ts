import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './get-routes';

// Vue.use(VueRouter);

// const createRouter = () =>
//   new VueRouter({
//     // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
//     scrollBehavior: (to, from, savedPosition) => {
//       if (savedPosition) {
//         return savedPosition;
//       } else {
//         return { x: 0, y: 0 };
//       }
//     },
//     base: process.env.BASE_URL,
//     routes: asyncRoutes.concat(constantRoutes)
//   });
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location: any) {
//   return (originalPush.call(this, location) as any).catch((err: string) => err);
// };

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
