<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <p>{{ statusText }}</p>
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="setLightStyle"
          >状态栏深色背景文本</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="setDarkStyle"
          >状态栏浅色背景文本</van-button
        >
      </div>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
// import { useRoute, useRouter, RouteLocationRaw } from "vue-router";
import { defineComponent, onMounted, reactive, toRefs } from "vue";

export default defineComponent({
  name: "statusbar",
  setup() {
    const route = useRoute(); // 获取params等参数
    onMounted(() => {
      onDeviceReady();
    });
    const data: any = reactive({
      statusText: "状态栏：浅色背景, 深色文本",
    });

    // 状态栏颜色
    const onDeviceReady = () => {
      // const router = useRouter(); // 用于跳转等
      // router.push(route.params.toPath as RouteLocationRaw);
      console.log(route);
      // 根据路由动态改变状态栏样式
      // cordova插件会定义一个StatusBar对象，当它只能在deviceready后才能使用
      // 给状态栏字体色为白色的路由都设置了一个路由元meta, 属性isLightText为true
      if (typeof StatusBar != "undefined") {
        route.meta.isLightText
          ? StatusBar.styleLightContent()
          : StatusBar.styleDefault();
        if (route.query && route.query.active === "1") {
          StatusBar.styleDefault();
        }
      }
    };

    const setLightStyle = () => {
      if (typeof StatusBar != "undefined") {
        data.statusText = "状态栏：深色背景, 浅色文本";
        StatusBar.styleLightContent();
      }
    };
    const setDarkStyle = () => {
      if (typeof StatusBar != "undefined") {
        data.statusText = "状态栏：浅色背景, 深色文本";
        StatusBar.styleDefault();
      }
    };

    return {
      ...toRefs(data),
      setLightStyle,
      setDarkStyle,
    };
  },
});
</script>
<style scoped>
.common-row {
  width: 100%;
  padding-top: 2%;
}
.common-row ul {
  width: 100%;
}
.common-row ul li {
  width: 100%;
}
.row-item {
  display: inline-block;
  height: 23px;
  line-height: 23px;
}
.text-align__right {
  text-align: right;
  padding-right: 3px;
}
.text-align__left {
  text-align: left;
  padding-left: 3px;
}
</style>
