<template>
  <div id="main-wrapper" style="overflow-y: auto">
    <div id="content-wrapper">
      <!-- 状态栏相关 -->
      <statusbar />

      <!-- 文件读写及权限相关 -->
      <file />

      <!-- 相册/相机相关 -->
      <gallery />

      <!-- 设备信息相关 -->
      <deviceInfo />

      <!-- sqllite相关 -->
      <sqllite />

      <!-- 录音相关 -->
      <audio-component />

      <!-- 第三方app相关 -->
      <application />

      <!-- keyboard相关 -->
      <keyboard-component />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRefs,
} from "vue";

import gallery from "/@/views/cordova/gallery.vue";
import sqllite from "/@/views/cordova/sqllite.vue";
import application from "/@/views/cordova/application.vue";
import deviceInfo from "/@/views/cordova/device.vue";
import statusbar from "/@/views/cordova/statusbar.vue";
import keyboardComponent from "/@/views/cordova/keyboard.vue";
import file from "/@/views/cordova/file.vue";
import audioComponent from "/@/views/cordova/audio.vue";

import { Toast } from "vant";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    gallery,
    sqllite,
    application,
    deviceInfo,
    statusbar,
    file,
    keyboardComponent,
    audioComponent,
  },
  setup() {
    const route = useRoute();
    const data = reactive({
      exitAppTicker: 0,
    });

    onMounted(() => {
      document.addEventListener("backbutton", backbutton);
    });

    // 判断是否为首页
    const isHomePage = () => {
      let path = route.path; // path.match(RegExp(/layout/))
      let homePath = ["/", "/home"];
      if (homePath.includes(path)) {
        return true;
      } else {
        return false;
      }
    };

    const backbutton = () => {
      if (isHomePage()) {
        if (data.exitAppTicker === 0) {
          data.exitAppTicker++;
          Toast({
            message: "再按一次退出程序",
            position: "bottom",
            duration: 1000,
          });
          setTimeout(() => {
            data.exitAppTicker = 0;
          }, 2000);
        } else if (data.exitAppTicker === 1) {
          navigator.app.exitApp(); //退出app
        }
      } else {
        console.log("返回键事件触发");
        history.back();
      }
    };

    onBeforeUnmount(() => {
      document.removeEventListener("backbutton", backbutton);
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped></style>
