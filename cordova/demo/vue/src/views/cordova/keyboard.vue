<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button plain type="primary" size="small" @click="doShowKeyboard"
          >弹出键盘(未遮挡效果)</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click="doShowKeyboardHidenDom"
          >弹出键盘(遮挡效果)</van-button
        >
      </div>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import { Toast } from "vant";

export default defineComponent({
  // name: "keyboardComponent",
  setup() {
    const data: any = reactive({
      isBeCovered: false,
    });

    onMounted(() => {
      window.addEventListener("keyboardDidHide", () => {
        doKeyboardDidHide();
      });
      window.addEventListener("keyboardDidShow", (e) => {
        doKeyboardDidShow(e);
      });
    });

    const doShowKeyboard = () => {
      data.isBeCovered = false;
      console.log(Keyboard.isVisible);
      if (Keyboard.isVisible) {
        console.log("keyboard is showing");
      } else {
        // 增加延时执行防止出现后就消失
        setTimeout(() => {
          Keyboard.show();
        }, 100);
      }
    };
    const doShowKeyboardHidenDom = () => {
      data.isBeCovered = true;
      setTimeout(() => {
        Keyboard.show();
      }, 100);
    };

    const doKeyboardDidHide = () => {
      Toast({
        message: "键盘已收起",
        position: "bottom",
        duration: 2000,
      });
      let mainWrapper = document.getElementById("main-wrapper");
      let contentWrapper = document.getElementById("content-wrapper");
      mainWrapper.style.height = "auto";
      contentWrapper.style.height = "auto";
    };
    const doKeyboardDidShow = (e: Event) => {
      console.log(e);
      Toast({
        message: "键盘已弹出",
        position: "bottom",
        duration: 2000,
      });
      setTimeout(() => {
        if (!data.isBeCovered) {
          let mainWrapper = document.getElementById("main-wrapper");
          let contentWrapper = document.getElementById("content-wrapper");

          let h = e.keyboardHeight;
          let totalHeight = document.documentElement.clientHeight;

          if (document.activeElement.tagName === "BUTTON") {
            let gap =
              totalHeight -
              document.activeElement.getBoundingClientRect().top -
              h;
            // 20: 当出现软键盘时, 软键盘距离元素的距离
            if (gap < 60) {
              mainWrapper.style.height = mainWrapper?.offsetHeight + "px";
              contentWrapper.style.height =
                mainWrapper.offsetHeight + Math.abs(gap) + 60 + "px";
              document.activeElement.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      }, 100);
    };
    onBeforeUnmount(() => {
      window.removeEventListener("keyboardDidHide", doKeyboardDidHide);
      window.removeEventListener("keyboardDidShow", doKeyboardDidShow);
    });
    return {
      ...toRefs(data),
      doShowKeyboard,
      doShowKeyboardHidenDom,
    };
  },
});
</script>
<style scoped></style>
