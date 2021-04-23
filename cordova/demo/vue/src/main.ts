import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setVant } from "./config/setVant"; // vant导入

import "lib-flexible/flexible"; // px在h5自动转rem
import "./assets/css/reset.css";
import "./index.css";
import "vant/lib/index.css"; // 全局引入样式
import "./mock"; // mockjs
import "./assets/css/vant.css";
import "./assets/css/common.css";

import selfDirective from "./directives/touch/index";

const app = createApp(App); // 创建实例

app.use(router);
app.use(selfDirective);

setVant(app);

// app.mount("#app");
document.addEventListener(
  "deviceready",
  () => {
    console.log("deviceready");
    app.mount("#app");
  },
  false
);
