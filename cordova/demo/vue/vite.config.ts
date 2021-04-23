const path = require("path");
import { UserConfig } from "vite";

const config: UserConfig = {
  alias: {
    "/@/": path.resolve(__dirname, "src"),
  },
  proxy: {
    "/api": {
      target: "http://localhost:8081",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: "./",
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: "../demo/www", // 直接输出到cordova项目路径, 方便调试
  // 输出的静态资源的文件夹名称
  assetsDir: "assets",
  port: 3000,
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  // 引入第三方的配置
  optimizeDeps: {
    include: [
      "lib-flexible/flexible",
      "lodash-es",
      "axios",
      "better-mock",
      "vue-request",
    ],
  },
};

export default config;
