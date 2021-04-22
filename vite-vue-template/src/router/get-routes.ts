/**
 * 路由自动注册
 * 遍历modules目录下所有 *.ts 文件，内部为路由信息
 * https://cn.vitejs.dev/guide/features.html#glob-import
 * https://github.com/vitejs/vite/issues/77
 */
import { RouteRecordRaw } from 'vue-router';

const modules = import.meta.globEager('./modules/**/**.ts');

// eslintno-restricted-syntax
// const routes: RouteRecordRaw[] = [];
// for (const path in modules) {
//   routes.push(...modules[path].default);
// }

const routes: RouteRecordRaw[] = [].concat(...Object.values(modules).map((item) => item.default));

export default routes;
